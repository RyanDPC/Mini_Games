const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Route pour la connexion utilisateur
router.post('/login', userController.login);

// Route pour récupérer tous les utilisateurs
router.get('/all', userController.getAllUsers);

// Route pour accéder à un utilisateur par son pseudo
router.get('/:username', userController.getUserByUsername);

module.exports = router;
