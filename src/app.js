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
require('dotenv').config()

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
            connectSrc: ["'self'", "https://localhost:4000"], // Autorise les connexions à votre API
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
    genid: (req) => uuid.v4(), // Générer un identifiant de session unique pour chaque utilisateur
    secret: 'votre_clé_secrète', // Remplacez par une clé sécurisée
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true, // Utilisez true pour HTTPS
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

// Importer les routes
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');

// Définir les routes d'API
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/auth', authRoutes);

// Routes pour les pages principales
app.get('/', (req, res) => {
    const user = req.session.user || null;
    res.render('index', { user });
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

// Démarrer le serveur
server.listen(4000, () => {
    console.log("Serveur HTTPS en cours d'exécution sur https://localhost:4000");
});
