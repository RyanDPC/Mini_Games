import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision } from "./collision.js";
import { drawScore } from "./score.js";
import { drawGameOverMenu} from "./menu.js";

// Sélectionne le canvas de la page HTML et obtient le contexte 2D pour dessiner
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Définit la taille d'une case (20px) et initialise les variables nécessaires au jeu
const box = 20;
let gameSpeed = 400; // Vitesse initiale du jeu (en millisecondes)
let snake; // Tableau pour stocker les segments du serpent
let food; // Position actuelle de la nourriture
let animationFrameId; // Identifiant pour l'animation
let lastTime = 0; // Temps de la dernière mise à jour
let direction = "RIGHT"; // Direction initiale du serpent
let score = 0; // Score initial
let isRunning = false;


/**
* Démarre le jeu après le menu.
*/
export function startGameAfterMenu() {
  isRunning = true; // Active le jeu

  // Annule toute animation en cours
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  startGame(); // Démarre le jeu
}

/**
 * Dessine un rectangle coloré (case) sur le canvas.
 *
 * @param {number} x - Position en x de la case.
 * @param {number} y - Position en y de la case.
 * @param {string} color - Couleur de la case.
 */
export function DrawTile(x, y, color) {
  ctx.fillStyle = color; // Définit la couleur de remplissage
  ctx.fillRect(x, y, box, box); // Dessine un rectangle de taille `box`
}

// Ajoute un écouteur d'événements pour détecter les touches appuyées
document.addEventListener("keydown", (event) => {
  // Met à jour la direction du serpent en fonction de la touche pressée
  direction = handleDirectionChange(event, direction);
});

function setupGameOverRestart() {
  document.addEventListener("keydown", function handleKey(event) {
    if (event.key === "Enter") {
      document.removeEventListener("keydown", handleKey); // Supprime l'écouteur après redémarrage
      startGameAfterMenu(); // Redémarre le jeu
    }
  });
}

/**
 * Initialise les variables et démarre le jeu.
 */
function startGame() {
  snake = initSnake(); // Initialise le serpent avec sa position de départ
  food = generateFood(box, canvas); // Génère la nourriture à une position aléatoire
  score = 0; // Réinitialise le score
  direction = "RIGHT"; // Réinitialise la direction initiale

  // Annule toute animation en cours
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Démarre la boucle de mise à jour
  update();
}

/**
 * Met à jour l'état du jeu à chaque cycle.
 *
 * @param {number} currentTime - Temps actuel en millisecondes, fourni par `requestAnimationFrame`.
 */
function update(currentTime) {
  if (isMenuActive) {
    return; // Empêche toute autre logique de mise à jour
  }

  if (!isRunning) {
    return; // Si le jeu n'est pas actif, ne continue pas
  }

  // Vérifie si le délai entre les mises à jour n'est pas encore écoulé
  if (currentTime - lastTime < gameSpeed) {
    requestAnimationFrame(update); // Continue d'attendre la prochaine mise à jour
    return;
  }

  lastTime = currentTime; // Met à jour le dernier temps de mise à jour

  // Déplace le serpent dans la direction actuelle
  moveSnake(snake, direction, box, food, score, canvas);

  // Récupère la tête actuelle du serpent
  let head = snake[0];

  // Vérifie si le serpent mange la nourriture
  if (checkFoodCollision(snake[0], food)) {
    score++; // Augmente le score
    food = generateFood(snake, box, canvas); // Génère une nouvelle nourriture
  } else {
    snake.pop(); // Retire le dernier segment si pas de nourriture mangée
  }
  // Vérifie les collisions : avec les murs ou le corps du serpent
  if (checkCollision(head, snake) || checkWallCollision(head, canvas)) {
    console.log("GAME OVER !"); // Affiche un message de fin de jeu dans la console
    cancelAnimationFrame(animationFrameId); // Arrête l'animation
    drawGameOverMenu(canvas, ctx, score, setupGameOverRestart);
    setupGameOverRestart();
    return;
  }

  draw(); // Dessine l'état actuel du jeu
  requestAnimationFrame(update); // Demande la prochaine mise à jour
}


/**
 * Dessine les éléments du jeu sur le canvas.
 */
function draw() {
  // Efface le canvas pour redessiner
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessine le serpent
  drawSnake(snake);

  // Dessine la nourriture
  drawFood(food);

  // Dessine le score actuel
  drawScore(ctx, score);
}