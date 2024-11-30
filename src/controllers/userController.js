const db = require('../../config/db'); // Connexion à la base de données
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe

// Méthode pour l'inscription d'un utilisateur
exports.register = (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    db.get('SELECT * FROM user WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (row) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
        }

        // Hasher le mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insérer l'utilisateur dans la base de données
        const sql = 'INSERT INTO user (username, password, profile_picture) VALUES (?, ?, ?)';
        const profilePicture = '1.png';  // Exemple d'assignation d'un PDP aléatoire
        db.run(sql, [username, hashedPassword, profilePicture], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
            }
            res.status(201).json({
                id: this.lastID,
                username,
                profile_picture: profilePicture
            });
        });
    });
};

// Méthode pour la connexion d'un utilisateur
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    db.get('SELECT * FROM user WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (!row) {
            return res.status(400).json({ error: 'Nom d\'utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        if (!bcrypt.compareSync(password, row.password)) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Retourner les données de l'utilisateur (sans mot de passe)
        res.status(200).json({
            id: row.id,
            username: row.username,
            profile_picture: row.profile_picture
        });
    });
};

// Méthode pour récupérer tous les utilisateurs (accessible uniquement par Ryan)
exports.getAllUsers = (req, res) => {
    const authorizedUser = req.user; // Cela dépend de votre mécanisme d'authentification

    if (authorizedUser && authorizedUser.username === 'Ryan') {
        // Si l'utilisateur est Ryan, récupérer tous les utilisateurs
        db.all('SELECT id, username, profile_picture FROM user', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur de base de données' });
            }
            res.status(200).json(rows);
        });
    } else {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }
};
