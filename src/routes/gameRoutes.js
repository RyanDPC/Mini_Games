// Importer les modules nécessaires
const express = require('express');
const { getGames } = require('../controllers/gameController');

const router = express.Router();

// Route pour récupérer tous les jeux disponibles
router.get('/', getGames);

module.exports = router;
