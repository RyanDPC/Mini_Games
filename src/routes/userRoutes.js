const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Route pour l'inscription utilisateur
router.post('/register', userController.register);

// Route pour la connexion utilisateur
router.post('/login', userController.login);

// Route pour récupérer tous les utilisateurs (accessible uniquement par Ryan)
router.get('/all', userController.getAllUsers);

// Route pour ajouter un ami
router.post('/add-friend', userController.addFriend);

// Route pour récupérer la liste des amis d'un utilisateur
router.get('/friends/:userId', userController.getFriendsList);

// Route pour envoyer une demande d'ami
router.post('/send-friend-request', userController.sendFriendRequest);

// Route pour accepter une demande d'ami
router.post('/accept-friend-request', userController.acceptFriendRequest);

// Route pour refuser une demande d'ami
router.post('/reject-friend-request', userController.rejectFriendRequest);

// Route pour supprimer un ami
router.post('/remove-friend', userController.removeFriend);

// Route pour mettre à jour les tokens d'un utilisateur
router.post('/update-tokens', userController.updateTokens);

router.get('/search', userController.searchUsersByUsername);

module.exports = router;
