const db = require('../../config/db'); // Connexion à la base de données SQLite

// Envoyer une demande d'ami
exports.sendFriendRequest = (userId, friendId, callback) => {
    
    if (!userId || !friendId) {
        return callback(new Error('userId ou friendId manquant'), null);
    }

    // Vérifiez si la relation existe déjà (soit en attente, soit acceptée)
    const sql = 'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)';
    db.get(sql, [userId, friendId, friendId, userId], (err, friendship) => {
        if (err) {
            return callback(err, null);
        }

        if (friendship) {
            return callback(new Error('Une relation existe déjà entre ces utilisateurs.'), null);
        }

        // Insérer une nouvelle demande d'ami (statut "sent" pour celui qui envoie et "pending" pour le destinataire)
        const insertSql = 'INSERT INTO friends (user_id, friend_id, status, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
        db.run(insertSql, [userId, friendId, 'pending'], function (err) {
            if (err) {
                return callback(err, null);
            }

            // Insérer l'autre côté de la relation avec statut "pending"
            db.run(insertSql, [friendId, userId, 'pending'], function (err) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, { userId, friendId, status: 'sent' });
            });
        });
    });
};

// Accepter une demande d'ami
exports.acceptFriendRequest = (userId, friendId, callback) => {
    const sql = 'UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?';
    db.run(sql, ['accepted', userId, friendId], function (err) {
        if (err) {
            return callback(err, null);
        }

        db.run(sql, ['accepted', friendId, userId], function (err) {
            if (err) {
                return callback(err, null);
            }
            callback(null, { userId, friendId, status: 'accepted' });
        });
    });
};

// Rejeter une demande d'ami
exports.rejectFriendRequest = (userId, friendId, callback) => {
    const sql = 'DELETE FROM friends WHERE user_id = ? AND friend_id = ?';
    db.run(sql, [userId, friendId], function (err) {
        if (err) {
            return callback(err, null);
        }
        db.run(sql, [friendId, userId], function (err) {
            if (err) {
                return callback(err, null);
            }
            callback(null, { userId, friendId, status: 'rejected' });
        });
    });
};

// Récupérer la liste des amis
exports.getFriendsList = (userId, limit, offset, callback) => {
    const query = `
        SELECT friends.friend_id AS id, users.username
        FROM friends
        INNER JOIN users ON friends.friend_id = users.id
        WHERE friends.user_id = ?
        LIMIT ? OFFSET ?
    `;
    
    db.all(query, [userId, limit, offset], (err, rows) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL :', err);
            return callback(err);
        }
        callback(null, rows);
    });
};

// Supprimer un ami
exports.removeFriend = (userId, friendId, callback) => {
    const sql = 'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)';
    db.run(sql, [userId, friendId, friendId, userId], function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null, { userId, friendId, status: 'removed' });
    });
};
