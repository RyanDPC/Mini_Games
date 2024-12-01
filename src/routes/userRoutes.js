const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenService = require('../services/tokenService');

// Route pour l'enregistrement d'un utilisateur
router.post('/register', userController.register);

// Route pour la connexion d'un utilisateur
router.post('/login', userController.login);

// Route pour récupérer le profil utilisateur
router.get('/profile', tokenService.verifyToken, userController.getProfile);

module.exports = router;
