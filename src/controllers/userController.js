const db = require('../../config/db'); // Connexion à la base de données
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe

// Liste des images de profil disponibles
const profilePics = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

// Méthode pour l'inscription d'un utilisateur
exports.register = (req, res) => {
    const { username, password, email } = req.body;

    // Vérifier si l'utilisateur existe déjà
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (row) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
        }

        // Hasher le mot de passe
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Sélectionner une image de profil aléatoire parmi les options
        const profilePic = profilePics[Math.floor(Math.random() * profilePics.length)];

        // Définir le nombre de tokens par défaut à 200
        const tokens = 200;

        // Insérer l'utilisateur dans la base de données avec `created_at` en utilisant CURRENT_TIMESTAMP
        const sql = 'INSERT INTO users (username, password, email, tokens, profile_pic, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
        db.run(sql, [username, hashedPassword, email, tokens, profilePic], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
            }
            res.status(201).json({
                id: this.lastID,
                username,
                tokens: tokens,
                profile_pic: profilePic, // Retourner l'URL de l'image de profil
                created_at: new Date().toISOString() // Retourner la date de création
            });
        });
    });
};

// Méthode pour la connexion d'un utilisateur
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe dans la base de données
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        // Si l'utilisateur n'existe pas
        if (!row) {
            return res.status(400).json({ error: 'Nom d\'utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        if (!bcrypt.compareSync(password, row.password)) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Si la connexion réussit, retourner le nom d'utilisateur, les tokens, et l'image de profil
        res.status(200).json({
            username: row.username,
            tokens: row.tokens,      // Nombre de tokens de l'utilisateur
            profile_pic: row.profile_pic // Image de profil de l'utilisateur
        });
    });
};


// Méthode pour mettre à jour les tokens d'un utilisateur après un pari
exports.updateTokens = (req, res) => {
    const { userId, betAmount, isWin } = req.body;

    // Vérifier si l'utilisateur existe
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (!row) {
            return res.status(400).json({ error: 'Utilisateur non trouvé' });
        }

        let newTokens = row.tokens;

        // Si c'est une victoire, on ajoute les tokens
        if (isWin) {
            newTokens += betAmount;
        } else {
            // Si c'est une défaite, on enlève les tokens
            newTokens -= betAmount;
        }

        // Mettre à jour les tokens dans la base de données
        const sql = 'UPDATE users SET tokens = ? WHERE id = ?';
        db.run(sql, [newTokens, userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la mise à jour des tokens' });
            }
            res.status(200).json({
                message: `Tokens mis à jour. Nouveau solde: ${newTokens}`,
                tokens: newTokens // Retourner le nouveau nombre de tokens
            });
        });
    });
};

// Méthode pour récupérer tous les utilisateurs (accessible uniquement par Ryan)
exports.getAllUsers = (req, res) => {
    const authorizedUser = req.user; // Cela dépend de votre mécanisme d'authentification

    if (authorizedUser && authorizedUser.username === 'Ryan') {
        // Si l'utilisateur est Ryan, récupérer tous les utilisateurs
        db.all('SELECT id, username, profile_pic, tokens FROM users', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur de base de données' });
            }
            res.status(200).json(rows);
        });
    } else {
        return res.status(403).json({ error: 'Accès non autorisé' });
    }
};
