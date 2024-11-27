const userModel = require('../models/userModel'); // Utilisation directe du modèle utilisateur

// Fonction pour récupérer tous les utilisateurs et leurs jetons
const getAllUsersWithTokens = async () => {
    // Récupérer tous les utilisateurs depuis la base de données
    const users = await userModel.findAllUsers();

    // Ajouter un champ "tokens" pour chaque utilisateur
    const AllUsers = users.map(user => {
        return {
            id: user.id,
            username: user.username,
            password: user.password, // Haché
            tokens: user.tokens || 1000, // Exemple : 1000 jetons par défaut si non défini
        };
    });

    return AllUsers;
};

// Exporter AllUsers
exports.AllUsers = async () => {
    const users = await getAllUsersWithTokens();
    return users;
};
