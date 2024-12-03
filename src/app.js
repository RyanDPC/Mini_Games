// Importer les modules nécessaires
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const uuid = require('uuid'); // Utilisé pour générer des identifiants de session uniques
require('dotenv').config();

// Vérifier si les secrets sont définis
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error('Erreur : Les variables JWT_SECRET ou REFRESH_TOKEN_SECRET ne sont pas définies.');
    process.exit(1); // Arrête l'application si les clés ne sont pas définies
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

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/views')));
app.use(express.static(path.join(__dirname, '../public/views/games')));
const gamesDirectory = path.join(__dirname, '../public/views/games');

// Middleware pour créer des routes dynamiques pour les jeux
// Route pour une page de jeu
app.get('/games/:gameName', (req, res) => {
    const gameName = req.params.gameName;
    const gamePath = path.join(__dirname, '../public/views/games', gameName, 'index.ejs');

    // Vérifier si le fichier de jeu existe
    if (fs.existsSync(gamePath)) {
        res.render(`games/${gameName}/index`, {
            user: req.session.user,
            isGamePage: true // Indiquer qu'il s'agit d'une page de jeu
        });
    } else {
        res.status(404).send('Jeu non trouvé');
    }
});
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
                // Vérifiez la présence des fichiers requis (index.ejs, img.png, style.css)
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
    res.render('index', { user, isGamePage: false });
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
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
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

// Démarrer le serveur
server.listen(4000, () => {
    console.log("Serveur HTTPS en cours d'exécution sur https://localhost:4000");
});
