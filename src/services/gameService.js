// gameService.js

const fs = require('fs');
const path = require('path');

// Chemin vers le dossier des jeux
const gamesPath = path.join(__dirname, '../../public/games');

// Fonction pour récupérer tous les jeux disponibles
function getAllGames() {
    return new Promise((resolve, reject) => {
        fs.readdir(gamesPath, (err, files) => {
            if (err) {
                return reject(new Error('Erreur lors de la lecture du dossier des jeux'));
            }

            const games = [];

            // Parcourir chaque sous-dossier dans le dossier des jeux
            files.forEach((file) => {
                const gameDir = path.join(gamesPath, file);

                // Vérifier si c'est un dossier
                if (fs.lstatSync(gameDir).isDirectory()) {
                    const indexPath = path.join(gameDir, 'index.html');

                    // Chercher un fichier PNG avec le même nom que le dossier
                    const pngFile = fs.readdirSync(gameDir).find(f => f.toLowerCase().endsWith('.png'));

                    // Vérifier si index.html et un fichier PNG existent
                    if (fs.existsSync(indexPath) && pngFile) {
                        games.push({
                            name: file,
                            indexUrl: `/games/${file}/index.html`,
                            imageUrl: `/games/${file}/${pngFile}`,
                        });
                    }
                }
            });

            resolve(games);
        });
    });
}

module.exports = {
    getAllGames,
};
