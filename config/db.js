const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/mini_games.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Fonction pour insérer un utilisateur dans la base de données
function insert(collection, document) {
    if (collection === 'users') {
        const { username, password } = document;
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.run(sql, [username, password], function (err) {
                if (err) {
                    reject(new Error(`Erreur lors de l'insertion de l'utilisateur: ${err.message}`));
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    } else {
        return Promise.reject(new Error('Collection non trouvée'));
    }
}

// Fonction pour trouver un utilisateur par nom d'utilisateur
function find(collection, criteria) {
    if (collection === 'users') {
        const { username } = criteria;
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(new Error(`Erreur lors de la recherche de l'utilisateur: ${err.message}`));
                } else {
                    resolve(row);
                }
            });
        });
    } else {
        return Promise.reject(new Error('Collection non trouvée'));
    }
}

// Fonction pour trouver un utilisateur par ID
function findById(collection, id) {
    if (collection === 'users') {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(new Error(`Erreur lors de la recherche de l'utilisateur par ID: ${err.message}`));
                } else {
                    resolve(row);
                }
            });
        });
    } else {
        return Promise.reject(new Error('Collection non trouvée'));
    }
}

module.exports = {
    insert,
    find,
    findById,
};
