// Importer le service de jeux
const { getAllGames } = require('../services/gameService');

// Fonction pour obtenir tous les jeux disponibles
async function getGames(req, res) {
    try {
        const games = await getAllGames(); // Appeler la fonction du service pour récupérer les jeux
        res.status(200).json(games); // Envoyer la liste des jeux en réponse
    } catch (error) {
        res.status(500).json({ error: error.message }); // Gérer les erreurs et envoyer un statut 500
    }
}

module.exports = {
    getGames,
};
