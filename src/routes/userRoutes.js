const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Route pour créer un nouvel utilisateur (inscription)
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    // Vérifier si l'utilisateur existe déjà
    userService.findUserByUsername(username, (err, user) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la vérification de l\'utilisateur.' });
        }

        if (user) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris, veuillez en choisir un autre.' });
        }

        // Créer l'utilisateur si le nom d'utilisateur n'est pas pris
        userService.createUser(username, password, (err, userId) => {
            if (err) {
                console.error('Erreur lors de la création de l\'utilisateur:', err.message);
                return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
            }

            res.status(201).json({ message: 'Utilisateur créé avec succès', userId });
        });
    });
});

// Route pour se connecter (connexion)
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    // Authentifier l'utilisateur
    userService.authenticateUser(username, password, (err, user) => {
        if (err) {
            console.error('Erreur lors de la connexion de l\'utilisateur:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la connexion.' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }

        // Si tout est correct, renvoyer un message de succès et les informations de l'utilisateur
        res.status(200).json({ message: 'Connexion réussie', user });
    });
});
module.exports = router;
