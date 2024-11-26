const express = require('express');
const router = express.Router();
const db = require('../db'); // Importer la connexion à la base de données

// Route pour créer un nouvel utilisateur (inscription)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    const query = `INSERT INTO users (username, password, tokens) VALUES (?, ?, ?)`;
    db.run(query, [username, password, 0], function (err) {
        if (err) {
            console.error('Erreur lors de la création de l\'utilisateur:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès', userId: this.lastID });
    });
});

// Route pour se connecter
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, user) => {
        if (err) {
            console.error('Erreur lors de la connexion de l\'utilisateur:', err.message);
            return res.status(500).json({ error: 'Erreur lors de la connexion.' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }

        res.status(200).json({ message: 'Connexion réussie', user });
    });
});

module.exports = router;
