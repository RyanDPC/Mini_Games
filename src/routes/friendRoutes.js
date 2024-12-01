const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const tokenService = require('../services/tokenService');

// Route pour envoyer une demande d'ami
router.post('/request', tokenService.verifyToken, friendController.sendFriendRequest);

// Route pour accepter une demande d'ami
router.post('/accept', tokenService.verifyToken, friendController.acceptFriendRequest);

// Route pour refuser une demande d'ami
router.post('/reject', tokenService.verifyToken, friendController.rejectFriendRequest);

// Route pour supprimer un ami
router.post('/remove', tokenService.verifyToken, friendController.removeFriend);

// Route pour récupérer la liste des amis (avec pagination)
router.get('/list', tokenService.verifyToken, friendController.getFriendsList);

// Route pour rechercher des utilisateurs
router.get('/search', tokenService.verifyToken, friendController.searchUsers);

module.exports = router;
