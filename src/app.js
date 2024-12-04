// Importer les modules nécessaires
const db = require('../config/db');
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const uuid = require('uuid');
const { Server } = require('socket.io');
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 20;

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error('Erreur : Les variables JWT_SECRET ou REFRESH_TOKEN_SECRET ne sont pas définies.');
    process.exit(1);
}

// Créer une instance d'Express
const app = express();

// Charger les fichiers de certificat SSL
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt')),
};

// Configurer Helmet pour sécuriser l'application
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://localhost:4000"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        },
    },
}));

// Configuration des middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    genid: (req) => uuid.v4(),
    secret: 'votre_clé_secrète',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    },
}));

// Configuration CORS
app.use(cors({
    origin: ['https://localhost:3000', 'https://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

// Middleware global pour ajouter l'utilisateur aux templates EJS
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/views')));
app.use(express.static(path.join(__dirname, '../public/views/games')));

const gamesDirectory = path.join(__dirname, '../public/views/games');

// Route pour les jeux
app.get('/games/:gameName', (req, res) => {
    const gameName = req.params.gameName;

    // Cas particulier pour Poker : rediriger vers le lobby
    if (gameName === 'Poker') {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        return res.render('games/Poker/index', {
            user: req.session.user,
            isGamePage: true, // C'est le lobby
        });
    }

    const gamePath = path.join(gamesDirectory, gameName, 'index.ejs');
    if (fs.existsSync(gamePath)) {
        res.render(`games/${gameName}/index`, {
            user: req.session.user,
            isGamePage: true,
        });
    } else {
        res.status(404).send('Jeu non trouvé');
    }
});

// Route pour le jeu principal de Poker
app.get('/games/Poker/main', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const game = {
        players: [
            { id: 1, name: 'Player 1', balance: 100 },
            { id: 2, name: 'Opponent 1', balance: 100 },
            { id: 3, name: 'Opponent 2', balance: 100 }
        ]
    };
    res.render('games/Poker/main', {
        user: req.session.user,
        game,
        isGamePage: true,
    });
});

// Route pour obtenir la liste des jeux
app.get('/api/games', (req, res) => {
    fs.readdir(gamesDirectory, (err, folders) => {
        if (err) {
            console.error('Erreur lors de la lecture du répertoire des jeux:', err);
            return res.status(500).json({ error: 'Erreur lors de la lecture du dossier des jeux' });
        }

        const games = [];

        folders.forEach((folder) => {
            const folderPath = path.join(gamesDirectory, folder);
            if (fs.lstatSync(folderPath).isDirectory()) {
                const indexFile = path.join(folderPath, 'index.ejs');
                const imgFile = path.join(folderPath, 'img.png');
                const cssFile = path.join(folderPath, 'style.css');

                if (fs.existsSync(indexFile) && fs.existsSync(imgFile) && fs.existsSync(cssFile)) {
                    games.push({
                        name: folder,
                        path: `/games/${folder}`
                    });
                }
            }
        });

        res.json(games);
    });
});

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const gameRoutes = require('./routes/gameRoutes');

// Définir les routes d'API
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/games', gameRoutes);

// Routes pour les pages principales
app.get('/', (req, res) => {
    const user = req.session.user || null;

    if (user) {
        db.get('SELECT tokens FROM users WHERE id = ?', [user.id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur interne du serveur');
            }
            const tokens = row ? row.tokens : 0;
            res.render('index', { user, isGamePage: false, tokens });
        });
    } else {
        res.render('index', { user, isGamePage: false });
    }
});

// Route pour la salle d'attente
app.get('/lobby', (req, res) => {
    const user = req.session.user || null;

    if (!user) {
        return res.redirect('/login');
    }

    res.render('games/lobby', { user });
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login');
});

app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register');
});

// Route pour déconnexion
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Déconnexion réussie.' });
    });
});

// Gestion des erreurs 404 et 500
app.use((req, res) => res.status(404).json({ error: 'Route non trouvée.' }));
app.use((err, req, res, next) => {
    console.error('Erreur interne du serveur :', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Créer le serveur HTTPS
const server = https.createServer(sslOptions, app);

// Initialiser Socket.io
const io = new Server(server);

// Gérer les connexions de Socket.io
// Gérer les connexions de Socket.io
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté à la salle d\'attente.');

    // Ecouter lorsqu'un utilisateur rejoint la salle d'attente
    socket.on('joinLobby', (user) => {
        console.log(`${user.username} a rejoint la salle d'attente.`);
        // Envoyer un événement à tous les clients pour notifier que le joueur a rejoint
        io.emit('playerJoined', { username: user.username });

        // Si nous avons assez de joueurs pour commencer (ex: 2 joueurs), démarrer le jeu
        if (io.engine.clientsCount >= 2) { // Exemple pour 2 joueurs
            io.emit('startGame');
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté de la salle d\'attente.');
    });
});
// Démarrer le serveur
server.listen(4000, () => {
    console.log("Serveur HTTPS en cours d'exécution sur https://localhost:4000");
});
