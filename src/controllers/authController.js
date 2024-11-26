// Importer le service d'authentification
const { registerUser, loginUser } = require('../services/authService');

// Fonction d'inscription
async function register(req, res) {
    const { username, password } = req.body;
    try {
        // Appeler le service d'inscription pour créer un nouvel utilisateur
        const userId = await registerUser(username, password);
        res.status(201).json({ message: 'Inscription réussie', userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Fonction de connexion
async function login(req, res) {
    const { username, password } = req.body;
    try {
        // Appeler le service de connexion pour vérifier l'utilisateur
        const user = await loginUser(username, password);
        res.status(200).json({ message: 'Connexion réussie', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
    register,
    login,
};
