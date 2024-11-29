const bcrypt = require('bcrypt');
const db = require('../../config/db'); // Connexion à la base de données

// Connexion utilisateur
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    // Vérifier si l'utilisateur existe
    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la vérification des informations de connexion.' });
        }

        if (!row) {
            return res.status(400).json({ error: 'Nom d’utilisateur ou mot de passe incorrect.' });
        }

        // Comparer le mot de passe
        bcrypt.compare(password, row.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe.' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Nom d’utilisateur ou mot de passe incorrect.' });
            }

            // Connexion réussie
            res.status(200).json({
                message: 'Connexion réussie.',
                user: { username: row.username, email: row.email, tokens: row.tokens }
            });
        });
    });
};

// Inscription d'un utilisateur
exports.register = (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Nom d\'utilisateur, mot de passe et email requis.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const checkQuery = `SELECT * FROM users WHERE username = ?`;

    db.get(checkQuery, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la vérification de l\'existence de l\'utilisateur.' });
        }

        if (row) {
            return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris.' });
        }

        // Hacher le mot de passe
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
            }

            // Insérer un nouvel utilisateur
            const insertQuery = `INSERT INTO users (username, password, email, tokens) VALUES (?, ?, ?, ?)`;

            db.run(insertQuery, [username, hashedPassword, email, 100], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
                }

                res.status(201).json({
                    message: 'Utilisateur créé avec succès.',
                    user: { username, email, tokens: 100 }
                });
            });
        });
    });
};

// Récupérer tous les utilisateurs (uniquement si l'utilisateur est Ryan)
exports.getAllUsers = (req, res) => {
    const { username, password } = req.query;

    // Vérifier les informations d'identification
    if (username === 'Ryan' && password === 'mdp') {
        const query = `SELECT * FROM users`;

        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
            }

            // Retourner tous les utilisateurs
            res.status(200).json(rows);
        });
    } else {
        return res.status(403).json({ error: 'Accès interdit. Seul Ryan peut voir tous les utilisateurs.' });
    }
};
