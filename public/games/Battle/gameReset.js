// gameReset.js

import { Enemy } from './enemy.js';

// Fonction de réinitialisation du jeu
export function resetGame(player, enemies, initialEnemyPositions, canvas, setGameState, currentWave) {
   
    // Réinitialiser l'état du jeu
    setGameState("main"); // Retour au menu principal

    // Réinitialiser la santé du joueur
    player.health = 3;
    player.isShielded = false;

    // Réinitialiser la position du joueur
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Supprimer tous les ennemis actuels
    enemies.length = 0;

   // Réinitialiser le compteur de vagues
   currentWave = {value:0} ;
   
    // Affiche un message pour indiquer que le jeu est réinitialisé
    console.log("Le jeu a été réinitialisé !");
}

// Fonction de réinitialisation de la vague d'ennemis
export function resetWave(enemies, initialEnemyPositions) {
    // Supprime tous les ennemis actuels
    enemies.length = 0;

    // Recrée les ennemis en utilisant leurs positions initiales
    initialEnemyPositions.forEach(position => {
        const newEnemy = new Enemy(
            position.x,
            position.y,
            50,  // Largeur par défaut de l'ennemi
            50,  // Hauteur par défaut de l'ennemi
            2,   // Vitesse par défaut de l'ennemi
            'red' // Couleur de l'ennemi
        );
        enemies.push(newEnemy);
    });

    console.log("La vague d'ennemis a été réinitialisée !");
}
