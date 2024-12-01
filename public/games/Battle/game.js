// Importation des modules nécessaires
import { showMainMenu, showLibrary, handleMenuInput, showPlayerSelection, getCurrentGameState} from './menu.js';  // Menu
import { Player, getPlayerByType } from './player.js';  // Joueur
import { Wave } from './wave.js';  // Vagues et spécialités
import {gameOver, resetWave } from './gameReset.js';  // Réinitialisation du jeu
import { Enemy } from './enemy.js';  // Ennemis

// Canvas et contexte
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

// Variables du jeu
let gameState = getCurrentGameState();  // Etat initial du jeu
let currentWave;  // Objet Wave pour la gestion des vagues
let playerLives = 3;
let player;
let keys = {};
let lastTime = 0; // Temps de la dernière frame

const targetFPS = 30; // Définir le nombre de FPS cible
const interval = 1000 / targetFPS; // Temps entre chaque image (en millisecondes)

// Fonction pour initialiser le jeu
function initializeGame() {
    player = new Player(canvas.width / 2, canvas.height / 2, 50, 50, "blue", 5);  // Création du joueur
    currentWave = new Wave(1, canvas, player);  // Première vague
    console.log("Game Initialized");
}
// Fonction principale de boucle du jeu
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= interval) {
        lastTime = currentTime - (deltaTime % interval);
        
        // Logique de mise à jour et de dessin selon l'état du jeu
        if (gameState === "play") {
            updateGame(deltaTime);
            drawGame();
        } else {
            handleMenu();  // Afficher le menu si le jeu n'est pas en cours
        }
    }
    
    // Appeler récursivement la boucle de jeu
    requestAnimationFrame(gameLoop);
}

// Fonction pour gérer les entrées clavier
function handleInput(e) {
    const key = e.key.toLowerCase();  // Convertir la touche en minuscule
    keys[key] = e.type === "keydown";  // Détecter si la touche est enfoncée ou relâchée
}

// Fonction pour vérifier si le joueur a perdu une vie (exemple avec les ennemis)
function playerLostLife() {
    return player.collidesWith(currentWave.enemies);  // Vérifier la collision avec les ennemis
}

// Mise à jour du mouvement du joueur
function updateGame(deltaTime) {
    player.move(keys, deltaTime / 1000);  // Mise à jour du mouvement du joueur avec deltaTime
    currentWave.manageWave();  // Gérer la vague actuelle
    
    // Vérification des collisions
    if (playerLostLife()) {
        playerLoseLife();  // Réduction de vie du joueur
    }
}

// Dessiner le jeu
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Effacer le canvas

    // Dessiner le joueur
    player.draw(ctx);
    currentWave.draw();  // Dessiner les ennemis de la vague

    // Afficher la barre de vie du joueur
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, playerLives * 20, 20);

    // Afficher la vague actuelle
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Wave: ${currentWave.waveNumber}`, canvas.width - 100, 30);
}

// Fonction pour gérer le menu
function handleMenu() {
    if (gameState === "main") {
        showMainMenu(ctx, canvas);
    } else if (gameState === "library") {
        showLibrary(ctx, canvas, currentWave.waveNumber);
    } else if (gameState === "playerSelection") {
        showPlayerSelection(ctx, canvas);
    }
}

// Fonction de perte de vie du joueur
function playerLoseLife() {
    playerLives--;
    if (playerLives <= 0) {
        gameOver();  // Si le joueur n'a plus de vies, afficher la fin du jeu
    } else {
        resetWave();  // Réinitialiser la vague
    }
}

// Démarrer le jeu
export function startGame() {
    gameState = "play";
    playerLives = 3;
    initializeGame();  // Initialisation du jeu
    gameLoop();  // Lancer la boucle de jeu
}
