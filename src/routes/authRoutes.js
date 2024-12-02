// Fichier authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Route pour rafraîchir le token d'accès
router.post('/token/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Assurez-vous que le refresh token est dans un cookie

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token manquant.' });
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
});

module.exports = router;
