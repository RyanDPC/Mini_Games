const friendModel = require('../models/friend');
const db = require('../../config/db'); // Connexion à la base de données

// Envoyer une demande d'ami
exports.sendFriendRequest = (req, res) => {
    const { userId } = req.user;
    const { friendId } = req.body;

    friendModel.sendFriendRequest(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande d\'ami.' });
        res.json({ message: 'Demande d\'ami envoyée.', result });
    });
};

// Accepter une demande d'ami
exports.acceptFriendRequest = (req, res) => {
    const { userId } = req.user;
    const { friendId } = req.body;

    friendModel.acceptFriendRequest(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de l\'acceptation de la demande d\'ami.' });
        res.json({ message: 'Demande d\'ami acceptée.', result });
    });
};
exports.getFriendsListByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const friends = await friendService.getFriendsByUserId(userId);
        res.json({ friends });
    } catch (error) {
        console.error('Erreur lors de la récupération des amis:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des amis.' });
    }
};

// Refuser une demande d'ami
exports.rejectFriendRequest = (req, res) => {
    const { userId } = req.user;
    const { friendId } = req.body;

    friendModel.rejectFriendRequest(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors du refus de la demande d\'ami.' });
        res.json({ message: 'Demande d\'ami refusée.', result });
    });
};

// Supprimer un ami
exports.removeFriend = (req, res) => {
    const { userId } = req.user;
    const { friendId } = req.body;

    friendModel.removeFriend(userId, friendId, (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la suppression de l\'ami.' });
        res.json({ message: 'Ami supprimé.', result });
    });
};

// Liste des amis avec pagination
exports.getFriendsList = (req, res) => {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    friendModel.getFriendsList(userId, parseInt(limit), parseInt(offset), (err, friends) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la récupération de la liste des amis.' });
        res.json({ friends });
    });
};

// Recherche d'utilisateurs
exports.searchUsers = (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Paramètre "query" requis pour la recherche.' });
    }

    const sql = 'SELECT id, username FROM users WHERE username LIKE ?';
    db.all(sql, [`%${query}%`], (err, users) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs.' });
        res.json({ users });
    });
};
