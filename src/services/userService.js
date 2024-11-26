// Importer le modèle utilisateur
const { createUser, findUserByUsername, findUserById } = require('../models/userModel');
const bcrypt = require('bcrypt');

// Fonction pour inscrire un nouvel utilisateur
async function registerUser(username, password) {
    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            throw new Error('Le nom d\'utilisateur est déjà pris.');
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, hashedPassword);
        return userId;
    } catch (error) {
        throw new Error('Erreur lors de l\'inscription de l\'utilisateur: ' + error.message);
    }
}

// Fonction pour obtenir un utilisateur par son ID
async function getUserById(userId) {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }
        return user;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l\'utilisateur: ' + error.message);
    }
}

// Fonction pour connecter un utilisateur
async function loginUser(username, password) {
    try {
        const user = await findUserByUsername(username);
        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }

        // Vérifier si le mot de passe est correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Mot de passe incorrect.');
        }

        return user;
    } catch (error) {
        throw new Error('Erreur lors de la connexion de l\'utilisateur: ' + error.message);
    }
}

module.exports = {
    registerUser,
    getUserById,
    loginUser,
};
