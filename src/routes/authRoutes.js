// Importer les modules nécessaires
const express = require('express');
const { register, login } = require('../controllers/authController');

// Créer un routeur Express
const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Exporter le routeur pour l'utiliser dans l'application principale
module.exports = router;
