// Importer les modules nécessaires
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Créer une instance d'Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Définir le port du serveur
const port = process.env.PORT || 4000;

// Middleware pour servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Route de base pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inclure les routes des jeux
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

// Ajouter les routes utilisateur
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Gestion des connexions via WebSocket
io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');

    // Écouter les messages des clients
    socket.on('message', (data) => {
        console.log('Message reçu:', data);
    });

    // Détecter la déconnexion des clients
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });

    // Exemple : émettre un événement "refresh" toutes les 5 minutes
    setInterval(() => {
        io.emit('refresh');
    }, 300000); // 5 minutes
});

// Gestion des erreurs 404 pour les routes non définies
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route non trouvée.' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Démarrer le serveur
server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
