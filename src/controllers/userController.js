const userService = require('../services/userService');

// Connexion utilisateur
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
        }

        // Valider l'utilisateur via userService
        const user = await userService.validateUser(username, password);

        res.status(200).json({
            message: 'Connexion réussie.',
            user: {
                username: user.username,
                tokens: user.tokens,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        res.status(401).json({ error: error.message });
    }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error.message);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};

// Obtenir un utilisateur par son pseudo
exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Le pseudo est requis.' });
        }

        // Récupérer l'utilisateur via userService
        const user = await userService.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur introuvable.' });
        }

        res.status(200).json({
            username: user.username,
            tokens: user.tokens,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error.message);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
