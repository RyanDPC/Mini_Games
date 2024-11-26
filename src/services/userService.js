const db = require('../../config/db');

// Fonction pour trouver un utilisateur par son nom d'utilisateur
function findUserByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
}

// Fonction pour créer un nouvel utilisateur
function createUser(username, password, callback) {
    const query = 'INSERT INTO users (username, password, tokens) VALUES (?, ?, ?)';
    db.run(query, [username, password, 0], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID);
    });
}

// Fonction pour authentifier un utilisateur
function authenticateUser(username, password, callback) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return callback(err);
        }
        if (!row) {
            return callback(null, null); // Utilisateur non trouvé ou mot de passe incorrect
        }
        callback(null, row);
    });
}
module.exports = {
    findUserByUsername,
    createUser,
    authenticateUser
};
