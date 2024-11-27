const userModel = require('../models/userModel');

// Valider les identifiants utilisateur
exports.validateUser = async (username, password) => {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
        throw new Error('Utilisateur introuvable.');
    }

    if (user.password !== password) {
        throw new Error('Mot de passe incorrect.');
    }
    console.log('Valeurs reçues :', { username, password });

    return user; // Retourne l'utilisateur s'il est valide
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async () => {
    const users = await userModel.findAllUsers();
    return users;
};
exports.getUserByUsername = async (username) => {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
        throw new Error('Utilisateur introuvable.');
    }
    return user;
};