const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Un token est requis pour accéder à cette ressource.' });
    }

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = decoded; // Ajoute les informations de l'utilisateur à la requête
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};
