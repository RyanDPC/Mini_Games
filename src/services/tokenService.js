// Importer le module JSON Web Token
const jwt = require('jsonwebtoken');

// Clé secrète pour signer les tokens (à garder en sécurité et ne jamais partager publiquement)
const secretKey = 'votre_clé_secrète';

// Fonction pour générer un token
async function generateToken(userId) {
    try {
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        return token;
    } catch (error) {
        throw new Error('Erreur lors de la génération du token: ' + error.message);
    }
}

// Fonction pour vérifier un token
async function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Erreur lors de la vérification du token: ' + error.message);
    }
}

module.exports = {
    generateToken,
    verifyToken,
};
