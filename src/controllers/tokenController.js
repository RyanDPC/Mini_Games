// Importer le service des tokens
const { generateToken, verifyToken } = require('../services/tokenService');

// Fonction pour générer un token
async function createToken(req, res) {
    const { userId } = req.body;
    try {
        // Générer un token pour l'utilisateur
        const token = await generateToken(userId);
        res.status(201).json({ message: 'Token créé avec succès', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fonction pour vérifier un token
async function validateToken(req, res) {
    const { token } = req.body;
    try {
        // Vérifier le token fourni
        const isValid = await verifyToken(token);
        if (!isValid) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        res.status(200).json({ message: 'Token valide' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
    createToken,
    validateToken,
};
