const friends = require('../models/friends');
const db = require('../../config/db'); // Connexion à la base de données
const auth = require('../middlewares/auth');

// Envoyer une demande d'ami
exports.sendFriendRequest = (req, res) => {
    const { userId } = req.user; // userId est extrait du token d'accès
    const { friendId } = req.body;
 // Ajoutez des logs ici pour voir ce qui est transmis
 console.log('User ID:', userId);
 console.log('Friend ID:', friendId);
 
    if (!friendId) {
        return res.status(400).json({ error: 'friendId requis pour envoyer une demande d\'ami.' });
    }

    friends.sendFriendRequest(userId, friendId, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'envoi de la demande d'ami :", err);
            if (err.message === 'Une relation existe déjà entre ces utilisateurs.') {
                return res.status(400).json({ error: 'Une relation existe déjà entre ces utilisateurs.' });
            }
            return res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande d\'ami.' });
        }
        res.json({ message: 'Demande d\'ami envoyée avec succès.', result });
    });
};
// Accepter une demande d'ami
exports.acceptFriendRequest = (req, res) => {
    const { userId } = req.user; // userId est extrait du token d'accès
    const { friendId } = req.body;

    friends.acceptFriendRequest(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de l\'acceptation de la demande d\'ami.' });
        res.json({ message: 'Demande d\'ami acceptée.', result });
    });
};

// Refuser une demande d'ami
exports.rejectFriendRequest = (req, res) => {
    const { userId } = req.user; // userId est extrait du token d'accès
    const { friendId } = req.body;

    friends.rejectFriendRequest(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors du refus de la demande d\'ami.' });
        res.json({ message: 'Demande d\'ami refusée.', result });
    });
};

// Supprimer un ami
exports.removeFriend = (req, res) => {
    const { userId } = req.user; // userId est extrait du token d'accès
    const { friendId } = req.body;

    friends.removeFriend(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la suppression de l\'ami.' });
        res.json({ message: 'Ami supprimé.', result });
    });
};

// Liste des amis avec pagination
exports.getFriendsList = (req, res) => {
    const { userId } = req.user; // userId est extrait du token d'accès
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    friends.getFriendsList(userId, parseInt(limit), parseInt(offset), (err, friends) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la récupération de la liste des amis.' });
        res.json({ friends });
    });
};

// Récupérer la liste des amis par userId
exports.getFriendsListByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const friends = await friendModel.getFriendsByUserId(userId);
        res.json({ friends });
    } catch (error) {
        console.error('Erreur lors de la récupération des amis:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des amis.' });
    }
};
