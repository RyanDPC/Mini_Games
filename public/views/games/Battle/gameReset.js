// gameReset.js

let currentWave = 1;  // Vague actuelle
let playerLives = 3;   // Nombre de vies du joueur
let isGameOver = false;  // Si le jeu est terminé ou non

// Fonction pour réinitialiser la vague lorsque le joueur perd un point de vie
export function resetWave() {
    // Si le joueur perd un point de vie, réinitialiser la vague
    if (playerLives > 0) {
        console.log(`Wave ${currentWave} has been reset!`);
        currentWave = 1;  // Remettre la vague à la première (ou à un état par défaut)
        // Vous pouvez ajouter des effets ou animations de réinitialisation ici.
    }
}

// Fonction pour gérer la fin du jeu
export function gameOver() {
    isGameOver = true;
    console.log("Game Over! Player has no lives left.");
    // Réinitialiser tout le jeu ici (santé, vagues, etc.)
    resetGame();
}

// Fonction pour réinitialiser le jeu
export function resetGame() {
    playerLives = 3;  // Remettre les vies à 3
    currentWave = 1;  // Remettre la vague à la 1ère
    enemies = spawnEnemiesForWave(currentWave);  // Générer les ennemis pour la première vague
    player = new Player(canvas.width / 2, canvas.height / 2, 50, 50, "blue", 5);  // Réinitialiser le joueur
    gameState = "main";   // Réinitialiser l'état du jeu
    console.log("Game has been reset. Ready for a new game!");

    // Vous pouvez ajouter d'autres réinitialisations, comme la réinitialisation des scores ou des positions
    // par exemple: resetScore(); resetPlayerPosition();
}

// Fonction pour simuler un événement de perte de vie (par exemple, collision avec un ennemi)
export function simulatePlayerDamage() {
    // Cette fonction est un exemple d'événement qui déclencherait la perte de vie
    console.log("Simulating player damage...");
    playerLoseLife();
}

// Fonction pour avancer à la vague suivante
export function nextWave() {
    if (!isGameOver) {
        currentWave++;
        console.log(`Advancing to Wave ${currentWave}`);
        // Logique pour préparer la prochaine vague (ennemis, obstacles, etc.)
    }
}

// Fonction pour afficher l'état actuel du jeu (utile pour debug ou affichage)
export function displayGameStatus() {
    console.log(`Current Wave: ${currentWave}`);
    console.log(`Player Lives: ${playerLives}`);
    console.log(`Is Game Over: ${isGameOver}`);
}
