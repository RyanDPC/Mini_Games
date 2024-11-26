// Importer le module de hachage des mots de passe
const bcrypt = require('bcrypt');
const { createUserInDatabase, findUserInDatabase } = require('../models/userModel');

// Fonction pour inscrire un utilisateur
async function registerUser(username, password) {
    try {
        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);
        return await createUserInDatabase(username, hashedPassword);
    } catch (error) {
        throw new Error('Erreur lors de l\'inscription de l\'utilisateur: ' + error.message);
    }
}

// Fonction pour connecter un utilisateur
async function loginUser(username, password) {
    try {
        // Trouver l'utilisateur par son nom d'utilisateur
        const user = await findUserInDatabase(username);
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
    loginUser,
};
