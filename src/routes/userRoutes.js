// Importer les modules nécessaires
const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Créer un routeur Express
const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/users', getUsers);

// Route pour récupérer un utilisateur par son ID
router.get('/users/:id', getUserById);

// Route pour créer un nouvel utilisateur
router.post('/users', createUser);

// Route pour mettre à jour un utilisateur existant
router.put('/users/:id', updateUser);

// Route pour supprimer un utilisateur
router.delete('/users/:id', deleteUser);

// Exporter le routeur pour l'utiliser dans l'application principale
module.exports = router;
