const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Route pour la connexion utilisateur
router.post('/login', userController.login);

// Route pour l'inscription utilisateur
router.post('/register', userController.register);

// Route pour récupérer tous les utilisateurs (accessible uniquement par Ryan)
router.get('/all', userController.getAllUsers);

router.post('/update-tokens', userController.updateTokens);
module.exports = router;
