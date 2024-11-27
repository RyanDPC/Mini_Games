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
