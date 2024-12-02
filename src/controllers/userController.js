const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Liste des images de profil possibles
const profilePics = [
    '/assets/pdp/1.jpg',
    '/assets/pdp/2.jpg',
    '/assets/pdp/3.jpg',
    '/assets/pdp/4.jpg',
    '/assets/pdp/5.jpg'
];

// Fonction pour générer un token JWT
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

// Fonction pour générer un refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// Enregistrement d'un utilisateur
exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const existingUser = await userModel.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
        const defaultTokens = 100;

        const newUser = await userModel.createUser(username, hashedPassword, email, randomProfilePic, defaultTokens);

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.json({ message: 'Inscription réussie.', accessToken, user: { id: newUser.id, username: newUser.username, email: newUser.email, profile_pic: newUser.profile_pic, tokens: newUser.tokens } });
    } catch (error) {
        console.error("Erreur serveur lors de l'inscription :", error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    try {
        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            profile_pic: user.profile_pic,
            tokens: user.tokens
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.json({ message: 'Connexion réussie.', accessToken, user: { id: user.id, username: user.username, profile_pic: user.profile_pic, tokens: user.tokens } });
    } catch (error) {
        console.error("Erreur serveur lors de la connexion :", error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Récupérer le profil utilisateur
exports.getProfile = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        res.json({ user: { id: user.id, username: user.username, email: user.email, profile_pic: user.profile_pic, tokens: user.tokens } });
    } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur :", error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur.' });
    }
};

// Rafraîchir le token d'accès
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token manquant.' });
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Refresh token invalide ou expiré.' });
    }
};

// Déconnexion de l'utilisateur
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
        }
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Déconnexion réussie.' });
    });
};
