const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route pour la connexion utilisateur
router.post('/login', userController.login);

// Route pour récupérer tous les utilisateurs
router.get('/all', userController.getAllUsers);

module.exports = router;
