// Importer les modules nécessaires
const userModel = require('../models/user');
const db = require('../../config/db'); // Importer la connexion à la base de données
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth'); // Importer votre middleware auth

// Liste des images de profil possibles
const profilePics = [
    '/assets/pdp/1.jpg',
    '/assets/pdp/2.jpg',
    '/assets/pdp/3.jpg',
    '/assets/pdp/4.jpg',
    '/assets/pdp/5.jpg'
];

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

        // Générer des tokens
        const accessToken = auth.generateAccessToken(newUser);
        const refreshToken = auth.generateRefreshToken(newUser);

        // Envoyer le refresh token dans un cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.json({ 
            message: 'Inscription réussie.', 
            accessToken, 
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                profile_pic: newUser.profile_pic,
                tokens: newUser.tokens 
            } 
        });
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

        // Stocker l'utilisateur dans la session
        req.session.user = {
            id: user.id,
            username: user.username,
            profile_pic: user.profile_pic,
            tokens: user.tokens
        };

        // Générer des tokens
        const accessToken = auth.generateAccessToken(user);
        const refreshToken = auth.generateRefreshToken(user);

        // Envoyer le refresh token dans un cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.json({ 
            message: 'Connexion réussie.', 
            accessToken, 
            user: {
                id: user.id,
                username: user.username,
                profile_pic: user.profile_pic,
                tokens: user.tokens,
            } 
        });
    } catch (error) {
        console.error("Erreur serveur lors de la connexion :", error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
// Recherche d'utilisateurs
exports.searchUsers = (req, res) => {
    const { username } = req.query;
    console.log('Requête reçue pour la recherche :', username); // Log pour la requête reçue

    if (!username) {
        return res.status(400).json({ message: 'Paramètre "username" requis pour la recherche.' });
    }

    const sql = 'SELECT id, username FROM users WHERE username LIKE ?';
    db.all(sql, [`%${username}%`], (err, users) => {
        if (err) {
            console.error('Erreur lors de la recherche des utilisateurs :', err); // Log de l'erreur SQL
            return res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs.' });
        }

        if (users.length === 0) {
            console.log(`Aucun utilisateur trouvé avec le nom : ${username}`); // Log lorsque l'utilisateur est introuvable
            return res.status(404).json({ message: 'Aucun utilisateur trouvé.' });
        }

        console.log('Résultat de la recherche :', users); // Log des utilisateurs trouvés
        res.json({ users });
    });
};

// Mettre à jour les jetons d'un utilisateur
exports.updateTokens = async (req, res) => {
    const { userId, betAmount } = req.body;

    console.log("Data received in updateTokens:", req.body);

    // Vérifier les données
    if (!userId || betAmount == null) {
        console.error("Missing userId or betAmount. Received:", req.body);
        return res.status(400).json({ message: 'L\'ID de l\'utilisateur et le montant de la mise sont requis.' });
    }

    // Convertir userId en nombre pour comparer avec session.user.id
    const userIdNumber = parseInt(userId, 10);

    // Vérifier que l'utilisateur connecté est celui qui fait la demande
    if (req.session.user.id !== userIdNumber) {
        console.error("User mismatch. Session user ID:", req.session.user.id, "Requested user ID:", userIdNumber);
        return res.status(403).json({ message: 'Non autorisé à mettre à jour les jetons de cet utilisateur.' });
    }

    // Calculer le nouveau solde
    const newTokens = req.session.user.tokens - betAmount;
    if (newTokens < 0) {
        console.error("Insufficient balance. Current tokens:", req.session.user.tokens, "Bet amount:", betAmount);
        return res.status(400).json({ message: 'Solde insuffisant.' });
    }

    try {
        await userModel.updateTokens(userIdNumber, newTokens);

        // Mettre à jour la session utilisateur
        req.session.user.tokens = newTokens;

        res.json({ message: 'Mise à jour des jetons réussie.', newTokens });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des jetons :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour des jetons.' });
    }
};


// Récupérer le profil utilisateur
exports.getProfile = async (req, res) => {
    const userId = req.session.user?.id;

    try {
        const user = await userModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profile_pic: user.profile_pic,
                tokens: user.tokens 
            } 
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur :", error);
        return res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur.' });
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
