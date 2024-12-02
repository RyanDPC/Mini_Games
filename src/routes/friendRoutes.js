const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const auth = require('../middlewares/auth');

// Route pour envoyer une demande d'ami
router.post('/request', auth.authenticateToken, friendController.sendFriendRequest);

// Route pour accepter une demande d'ami
router.post('/accept', auth.authenticateToken, friendController.acceptFriendRequest);

// Route pour refuser une demande d'ami
router.post('/reject', auth.authenticateToken, friendController.rejectFriendRequest);

// Route pour supprimer un ami
router.post('/remove', auth.authenticateToken, friendController.removeFriend);

// Route pour récupérer la liste des amis (avec pagination)
router.get('/list', auth.authenticateToken, friendController.getFriendsList);

// Route pour récupérer la liste des amis par userId
router.get('/:userId', auth.authenticateToken, friendController.getFriendsListByUserId);

module.exports = router;
