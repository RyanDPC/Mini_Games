// Importer les modules nécessaires
const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

// Créer une instance d'Express
const app = express();

// Charger les fichiers de certificat SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt'))
};

// Créer un serveur HTTPS en utilisant les certificats
const server = https.createServer(options, app);
const io = socketIo(server);

const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Route de base pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Routes des jeux et des utilisateurs
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Gestion des connexions via WebSocket
io.on('connect', (socket) => {
    console.log('Nouvel utilisateur connecté');
    socket.on('message', (data) => {
        console.log('Message reçu:', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });

    setInterval(() => {
        io.emit('refresh');
    }, 300000);
});

// Gestion des erreurs 404 et 500
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée.' });
});

app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Démarrer le serveur HTTPS
server.listen(port, () => {
    console.log(`Serveur HTTPS démarré sur https://localhost:${port}`);
});
