// userModel.js

const { insert, find, findById } = require('../../config/db');

// Fonction pour créer un nouvel utilisateur
async function createUser(username, password) {
    try {
        // Insérer l'utilisateur dans la base de données
        const newUser = await insert('users', { username, password });
        return newUser.id;
    } catch (error) {
        throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
}

// Fonction pour rechercher un utilisateur par son nom d'utilisateur
async function findUserByUsername(username) {
    try {
        // Rechercher l'utilisateur dans la base de données
        const user = await find('users', { username });
        return user;
    } catch (error) {
        throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
}

// Fonction pour obtenir un utilisateur par son ID
async function findUserById(userId) {
    try {
        // Rechercher l'utilisateur dans la base de données par ID
        const user = await findById('users', userId);
        return user;
    } catch (error) {
        throw new Error(`Erreur lors de la recherche de l'utilisateur par ID: ${error.message}`);
    }
}

module.exports = {
    createUser,
    findUserByUsername,
    findUserById,
};
