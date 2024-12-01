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
const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, username: user.username },
        'SECRET_KEY', // Remplacez par une clé secrète sécurisée
        { expiresIn: '1h' }
    );
};

// Enregistrement d'un utilisateur
exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        console.error("Erreur: Champs manquants lors de l'inscription.");
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        userModel.getUserByUsername(username, (err, existingUser) => {
            if (err) {
                console.error("Erreur lors de la vérification de l'utilisateur :", err);
                return res.status(500).json({ message: 'Erreur du serveur.' });
            }

            if (existingUser) {
                console.log("Nom d'utilisateur déjà pris :", username);
                return res.status(400).json({ message: 'Nom d\'utilisateur déjà pris.' });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Erreur lors du hachage du mot de passe :", err);
                    return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe.' });
                }

                // Choisir une photo de profil aléatoire
                const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];

                // Tokens par défaut (par exemple 100)
                const defaultTokens = 100;

                userModel.createUser(username, hashedPassword, email, randomProfilePic, defaultTokens, (err, newUser) => {
                    if (err) {
                        console.error("Erreur lors de la création de l'utilisateur :", err);
                        return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.' });
                    }

                    const token = generateToken(newUser);
                    console.log("Utilisateur inscrit avec succès :", newUser.username);
                    res.json({ message: 'Inscription réussie.', token, user: newUser });
                });
            });
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
        console.error("Erreur: Champs manquants lors de la connexion.");
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    userModel.getUserByUsername(username, (err, user) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
            return res.status(500).json({ message: 'Erreur du serveur.' });
        }

        if (!user) {
            console.log("Utilisateur introuvable :", username);
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Erreur lors de la vérification du mot de passe :", err);
                return res.status(500).json({ message: 'Erreur lors de la vérification du mot de passe.' });
            }

            if (!isMatch) {
                console.log("Mot de passe incorrect pour l'utilisateur :", username);
                return res.status(400).json({ message: 'Mot de passe incorrect.' });
            }

            // Stocker l'utilisateur dans la session
            req.session.user = {
                id: user.id,
                username: user.username,
                profile_pic: user.profile_pic,
                tokens: user.tokens // Ajoutez d'autres informations si nécessaire
            };

            const token = generateToken(user);
            console.log("Connexion réussie pour l'utilisateur :", username);
            res.json({ 
                message: 'Connexion réussie.', 
                token, 
                user: req.session.user // Renvoyer l'utilisateur avec la session
            });
        });
    });
};

// Récupérer le profil utilisateur
exports.getProfile = (req, res) => {
    const { userId } = req.user;

    userModel.getUserById(userId, (err, user) => {
        if (err) {
            console.error("Erreur lors de la récupération du profil utilisateur :", err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du profil utilisateur.' });
        }

        if (!user) {
            console.log("Utilisateur introuvable pour l'ID :", userId);
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        console.log("Profil utilisateur récupéré :", user.username);
        res.json({ user });
    });
};
