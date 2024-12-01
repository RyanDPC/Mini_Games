const db = require('../../config/db'); // Connexion à la base de données SQLite

// Créer un utilisateur
exports.createUser = (username, password, email, profilePic, tokens, callback) => {
    const query = 'INSERT INTO users (username, password, email, profile_pic, tokens) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [username, password, email, profilePic, tokens], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, username, email, profilePic, tokens });
    });
};

// Récupérer un utilisateur par son nom d'utilisateur
exports.getUserByUsername = (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

// Récupérer un utilisateur par son ID
exports.getUserById = (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], (err, user) => {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

// Mettre à jour les tokens d'un utilisateur
exports.updateTokens = (userId, newTokens, callback) => {
    const query = 'UPDATE users SET tokens = ? WHERE id = ?';
    db.run(query, [newTokens, userId], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, { userId, newTokens });
    });
};
