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

// Inclure les routes d'authentification
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Inclure les routes des jeux
const gameRoutes = require('./routes/gameRoutes');
app.use('/api', gameRoutes);

// Inclure les routes des utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Inclure les routes des tokens
const tokenRoutes = require('./routes/tokenRoutes');
app.use('/api/tokens', tokenRoutes);

// Gestion des connexions via WebSocket
io.on('connection', (socket) => {
    console.log('Nouvel utilisateur connecté');

    socket.on('message', (data) => {
        console.log('Message reçu:', data);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });

    // Envoyer un événement de "refresh" à tous les clients connectés
    setInterval(() => {
        io.emit('refresh');
    }, 300000); // 5 minutes
});

// Démarrer le serveur
server.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
