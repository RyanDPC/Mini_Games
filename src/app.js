// Importer les modules nécessaires
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Créer une instance d'Express
const app = express();

// Charger les fichiers de certificat SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt'))
};

// Configuration CORS
const corsOptions = {
    origin: ['https://localhost:3000', 'https://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

// Activer CORS
app.use(cors(corsOptions));

// Middleware pour servir les fichiers statiques et JSON
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Routes des jeux et des utilisateurs
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Gestion des erreurs 404 et 500
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée.' });
});

app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Démarrer un serveur HTTPS et WebSocket pour chaque port
const ports = [3000, 4000];
ports.forEach(port => {
    const serverInstance = https.createServer(options, app);
    const ioInstance = socketIo(serverInstance);

    // Gestion des connexions WebSocket
    ioInstance.on('connect', (socket) => {
        console.log(`Nouvel utilisateur connecté sur le port ${port}`);
        socket.on('message', (data) => {
            console.log(`Message reçu sur le port ${port}:`, data);
        });

        socket.on('disconnect', () => {
            console.log(`Utilisateur déconnecté du port ${port}`);
        });

        setInterval(() => {
            ioInstance.emit('refresh');
        }, 300000);
    });

    serverInstance.listen(port, () => {
        console.log(`Serveur HTTPS en cours d'exécution sur https://localhost:${port}`);
    });
});
