const db = require('../../config/db'); // Connexion à la base de données SQLite
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe
const jwt = require('jsonwebtoken'); // Pour générer des tokens JWT

// Liste des images de profil disponibles
const profilePics = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (user) {
                return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris' });
            }

            // Hacher le mot de passe avec bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Sélectionner une image de profil aléatoire
            const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];

            // Définir les tokens par défaut
            const defaultTokens = 200;

            // Ajouter l'utilisateur dans la base de données
            db.run('INSERT INTO users (username, password, email, profile_pic, tokens) VALUES (?, ?, ?, ?, ?)', 
                [username, hashedPassword, email, randomProfilePic, defaultTokens], 
                function(err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Erreur serveur' });
                    }

                    // Récupérer l'utilisateur inséré pour renvoyer les informations
                    const newUser = { username, profile_pic: randomProfilePic, tokens: defaultTokens, email };

                    // Créer un token JWT pour l'utilisateur
                    const token = jwt.sign({ userId: this.lastID, username: newUser.username }, 'SECRET_KEY', { expiresIn: '1h' });

                    // Renvoyer la réponse avec les données de l'utilisateur et le token
                    return res.json({
                        message: 'Inscription réussie',
                        token: token,
                        user: newUser
                    });
                });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    try {
        // Vérifier si l'utilisateur existe avec SQLite
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (!user) {
                return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }

            // Comparer les mots de passe avec bcrypt
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }

            // Créer un token JWT
            const token = jwt.sign({ userId: user.id, username: user.username }, 'SECRET_KEY', { expiresIn: '1h' });

            // Renvoyer les informations de l'utilisateur et le token
            return res.json({
                message: 'Connexion réussie',
                token: token,
                user: {
                    username: user.username,
                    profile_pic: user.profile_pic,
                    tokens: user.tokens,
                    email: user.email
                }
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        return res.json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter un ami (envoi d'une demande d'ami même si l'utilisateur est déconnecté)
exports.addFriend = (req, res) => {
    const { userId, friendUsername } = req.body;

    // Vérifier si l'utilisateur existe
    db.get("SELECT * FROM users WHERE username = ?", [friendUsername], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur du serveur' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur est déjà ami avec l'autre utilisateur
        db.get("SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", 
            [userId, user.id, user.id, userId], (err, friendship) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur du serveur' });
            }

            // Si la relation existe déjà, informer que c'est déjà un ami
            if (friendship) {
                if (friendship.status === 'accepted') {
                    return res.status(400).json({ error: 'Vous êtes déjà amis avec cet utilisateur.' });
                } else {
                    return res.status(400).json({ error: 'Une demande d\'ami est déjà en cours.' });
                }
            }

            // Si ce n'est pas un ami et qu'il n'y a pas de demande en cours, on envoie une demande d'ami
            db.run("INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)", 
                [userId, user.id, 'sent'], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'ami.' });
                }

                // L'autre utilisateur sera "en attente" de cette demande
                db.run("INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)", 
                    [user.id, userId, 'pending'], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'ami.' });
                    }
                    res.json({ message: 'Demande d\'ami envoyée avec succès !' });
                });
            });
        });
    });
};

// Récupérer la liste des amis d'un utilisateur
exports.getFriendsList = (req, res) => {
    const { userId } = req.params;

    db.all('SELECT users.username, friends.status FROM friends JOIN users ON users.id = friends.friend_id WHERE friends.user_id = ? OR friends.friend_id = ?', 
    [userId, userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur du serveur' });
        }

        const friends = rows.map(row => ({
            username: row.username,
            status: row.status
        }));

        return res.json({ friends });
    });
};


// Ajouter une demande d'ami
exports.sendFriendRequest = (req, res) => {
    const { userId, username } = req.body; // L'ID de l'utilisateur actuel et le nom d'utilisateur de l'ami

    // Vérifier si l'utilisateur existe
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur du serveur' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur est déjà ami avec la personne
        db.get("SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)", 
            [userId, user.id, user.id, userId], (err, friendship) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur du serveur' });
            }
            
            // Si la relation existe déjà, informer que c'est déjà un ami
            if (friendship) {
                if (friendship.status === 'accepted') {
                    return res.status(400).json({ error: 'Vous êtes déjà amis avec cet utilisateur.' });
                } else {
                    return res.status(400).json({ error: 'Une demande d\'ami est déjà en cours.' });
                }
            }

            // Si ce n'est pas un ami et qu'il n'y a pas de demande en cours, envoyer une nouvelle demande
            db.run("INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)", 
                [userId, user.id, 'sent'], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande d\'ami.' });
                }

                // De l'autre côté, l'utilisateur est "en attente"
                db.run("INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)", 
                    [user.id, userId, 'pending'], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la demande d\'ami.' });
                    }
                    res.json({ message: 'Demande d\'ami envoyée avec succès !' });
                });
            });
        });
    });
};

exports.acceptFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({ message: 'Les deux IDs sont requis' });
    }

    try {
        // Accepter la demande d'ami
        const result = await pool.query('UPDATE friends SET status = $1 WHERE user_id = $2 AND friend_id = $3 RETURNING *', ['accepted', userId, friendId]);

        return res.json({ message: 'Demande d\'ami acceptée', friend: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.rejectFriendRequest = async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({ message: 'Les deux IDs sont requis' });
    }

    try {
        // Refuser la demande d'ami
        const result = await pool.query('DELETE FROM friends WHERE user_id = $1 AND friend_id = $2 RETURNING *', [userId, friendId]);

        return res.json({ message: 'Demande d\'ami refusée', friend: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.updateTokens = async (req, res) => {
    const { userId, newTokens } = req.body;

    if (!userId || !newTokens) {
        return res.status(400).json({ message: 'ID utilisateur et nouveaux tokens sont requis' });
    }

    try {
        // Mettre à jour les tokens de l'utilisateur dans la base de données
        const result = await pool.query('UPDATE users SET tokens = $1 WHERE id = $2 RETURNING *', [newTokens, userId]);

        return res.json({ message: 'Tokens mis à jour', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
        return res.status(400).json({ message: 'Les deux IDs sont requis' });
    }

    try {
        // Supprimer l'ami de la liste d'amis
        const result = await pool.query(
            'DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1) RETURNING *',
            [userId, friendId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ami non trouvé ou déjà supprimé' });
        }

        return res.json({ message: 'Ami supprimé', removedFriend: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
// Fonction pour rechercher des utilisateurs par pseudo
exports.searchUsersByUsername = async (req, res) => {
    const { username } = req.query; // Récupère le pseudo dans les paramètres de la requête

    if (!username) {
        return res.status(400).json({ message: 'Nom d\'utilisateur requis.' });
    }

     // Requête SQL pour rechercher un utilisateur par son nom d'utilisateur
     const query = `SELECT * FROM users WHERE username = ?`;

     db.get(query, [username], (err, row) => {
         if (err) {
             console.error(err);
             return res.status(500).json({ message: 'Erreur interne du serveur' });
         }
 
         if (!row) {
             return res.status(404).json({ message: 'Utilisateur non trouvé.' });
         }
 
         // Si l'utilisateur est trouvé, renvoyer ses données
         return res.status(200).json(row);
     });
 };