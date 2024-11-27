const express = require('express');
const { getAllUsers } = require('../controllers/authController'); // Vérifiez cette ligne !

const router = express.Router();

// Route problématique
router.get('/', getAllUsers); // Si getAllUsers est undefined, cette route générera une erreur.

module.exports = router;
