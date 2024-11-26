const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '../data/mini_games.db');

// Connexion à la base de données SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

module.exports = db;
