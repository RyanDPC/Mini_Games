const sqlite3 = require('sqlite3').verbose();

// Connecter à la base de données mini_games.db
let db = new sqlite3.Database('./data/mini_games.db', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connexion à la base de données mini_games réussie.');
    }
});

module.exports = db;
