// Importer les modules nécessaires
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');

// Créer une instance d'Express
const app = express();

// Charger les fichiers de certificat SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt')),
};

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views')); // Répertoire des vues

// Configuration des sessions
app.use(
    session({
        secret: 'votre_clé_secrète', // Remplacez par une clé sécurisée
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // `false` en développement
    })
);

// Middleware pour rendre la variable 'user' disponible dans toutes les vues
app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Utilisateur connecté ou null
    next();
});

// Configuration CORS
const corsOptions = {
    origin: ['https://localhost:3000', 'https://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour servir les fichiers statiques et analyser les requêtes JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Importer les routes
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');

// Définir les routes d'API
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);

// Route pour la page principale
app.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render('index', { user });
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/'); // Rediriger si déjà connecté
    }
    res.render('login');
});

// Route pour la page d'inscription
app.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/'); // Rediriger si déjà connecté
    }
    res.render('register');
});

// Route pour déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
        }
        res.redirect('/login');
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée.' });
});

// Gestion des erreurs internes 500
app.use((err, req, res, next) => {
    console.error('Erreur interne du serveur :', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Fonction pour gérer les connexions WebSocket
const handleWebSocket = (serverInstance) => {
    const ioInstance = socketIo(serverInstance);

    ioInstance.on('connection', (socket) => {
        console.log(`Nouvel utilisateur connecté : ${socket.id}`);

        socket.on('message', (data) => {
            console.log('Message reçu :', data);
        });

        socket.on('disconnect', () => {
            console.log(`Utilisateur déconnecté : ${socket.id}`);
        });

        // Envoyer un événement de rafraîchissement toutes les 5 minutes
        setInterval(() => {
            ioInstance.emit('refresh');
        }, 300000);
    });
};

// Démarrer les serveurs HTTPS et WebSocket
const ports = [3000, 4000];

ports.forEach((port) => {
    const serverInstance = https.createServer(options, app);
    handleWebSocket(serverInstance);

    serverInstance.listen(port, () => {
        console.log(`Serveur HTTPS en cours d'exécution sur https://localhost:${port}`);
    });
});
