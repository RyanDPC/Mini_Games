// Importer les modules nécessaires
const express = require('express');
const { createToken, validateToken } = require('../controllers/tokenController');

// Créer un routeur Express
const router = express.Router();

// Route pour générer un token
router.post('/token', createToken);

// Route pour valider un token
router.post('/token/validate', validateToken);

// Exporter le routeur pour l'utiliser dans l'application principale
module.exports = router;
