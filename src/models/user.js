const db = require('../../config/db'); // Connexion à la base de données SQLite

// Créer un utilisateur
exports.createUser = (username, password, email, profilePic, tokens) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (username, password, email, profile_pic, tokens) VALUES (?, ?, ?, ?, ?)';
        db.run(query, [username, password, email, profilePic, tokens], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, username, email, profilePic, tokens });
        });
    });
};

// Récupérer un utilisateur par son nom d'utilisateur
exports.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, user) => {
            if (err) {
                return reject(err);
            }
            resolve(user);
        });
    });
};

// Récupérer un utilisateur par son ID
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.get(query, [id], (err, user) => {
            if (err) {
                return reject(err);
            }
            resolve(user);
        });
    });
};

// Mettre à jour les tokens d'un utilisateur
exports.updateTokens = (id, newTokens) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET tokens = ? WHERE id = ?';
        db.run(query, [newTokens, id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ userId: id, newTokens });
        });
    });
};

