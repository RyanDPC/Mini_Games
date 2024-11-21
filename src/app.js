// Importer les modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Créer une instance d'Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Définir le port du serveur
const port = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// Route de base pour servir la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/menu.html'));
});

// Inclure les routes des jeux
const gameRoutes = require('./routes/gameRoutes');
app.use('/api', gameRoutes);

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
    socket.emit('refresh');
  }, 300000); // 5 minutes
});

// Démarrer le serveur
server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
