const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Route pour l'enregistrement d'un utilisateur
router.post('/register', userController.register);

// Route pour la connexion d'un utilisateur
router.post('/login', userController.login);

// Route pour récupérer le profil utilisateur
router.get('/profile', auth.authenticateToken, userController.getProfile);

// Route pour la déconnexion de l'utilisateur
router.post('/logout', userController.logout);

// Route pour rechercher des utilisateurs
router.get('/search', userController.searchUsers);

module.exports = router;
