const db = require('../../config/db');

// Fonction pour récupérer tous les utilisateurs
exports.findAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, password, tokens FROM users'; // Inclut les jetons
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(new Error(`Erreur lors de la récupération des utilisateurs : ${err.message}`));
            } else {
                resolve(rows);
            }
        });
    });
};

// Fonction pour récupérer un utilisateur par pseudo
exports.findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, password, tokens FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(new Error(`Erreur lors de la recherche de l'utilisateur : ${err.message}`));
            } else {
                resolve(row || null); // Retourne null si aucun utilisateur n'est trouvé
            }
        });
    });
};

// Fonction pour mettre à jour un utilisateur
exports.updateUser = (id, { username, tokens }) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET username = ?, tokens = ? WHERE id = ?';
        db.run(sql, [username, tokens, id], (err) => {
            if (err) {
                reject(new Error(`Erreur lors de la mise à jour de l'utilisateur : ${err.message}`));
            } else {
                resolve();
            }
        });
    });
};
