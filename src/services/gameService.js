const fs = require('fs');
const path = require('path');

const gamesDirectory = path.join(__dirname, '../../public/games');

function getGames() {
    const gameFolders = fs.readdirSync(gamesDirectory);
    const games = [];

    gameFolders.forEach(folder => {
        const folderPath = path.join(gamesDirectory, folder);
        if (fs.lstatSync(folderPath).isDirectory()) {
            const htmlPath = path.join(folderPath, 'index.html');
            const imagePath = path.join(folderPath, `${folder}.png`);

            // Vérifier si le HTML existe pour que le jeu soit listé
            if (fs.existsSync(htmlPath) && fs.existsSync(imagePath)) {
                games.push({
                    name: folder,
                    image: `/games/${folder}/${folder}.png`,
                    path: `/games/${folder}/index.html`
                });
            }
        }
    });

    return games;
}

module.exports = { getGames };
