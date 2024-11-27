const { AllUsers } = require('../services/authService');

// Contrôleur pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await AllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
