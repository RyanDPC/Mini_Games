const db = require('../../config/db'); // Connexion à la base de données SQLite

// Envoyer une demande d'ami
exports.sendFriendRequest = (userId, friendId, callback) => {
    const sql = 'SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)';
    db.get(sql, [userId, friendId, friendId, userId], (err, friendship) => {
        if (err) {
            return callback(err, null);
        }

        if (friendship) {
            return callback(null, friendship); // Relation déjà existante
        }

        const insertSql = 'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)';
        db.run(insertSql, [userId, friendId, 'sent'], function (err) {
            if (err) {
                return callback(err, null);
            }

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
    const sql = `
        SELECT users.username, friends.status
        FROM friends
        JOIN users ON users.id = friends.friend_id
        WHERE friends.user_id = ? OR friends.friend_id = ?
        LIMIT ? OFFSET ?
    `;
    db.all(sql, [userId, userId, limit, offset], (err, rows) => {
        if (err) {
            return callback(err, null);
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
