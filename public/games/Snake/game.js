import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision, checkFoodCollision } from "./collision.js";
import { drawGameOverMenu, drawPauseOverlay} from "./menu.js";
import { startTimer,updateTimer, drawTimer} from "./timer.js";
// Sélectionne le canvas de la page HTML et obtient le contexte 2D pour dessiner
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let scoreBoard = document.querySelector('.score-board span');
// Définit la taille d'une case (20px) et initialise les variables nécessaires au jeu
const box = 20;
let gameSpeed = 400; // Vitesse initiale du jeu (en millisecondes)
let snake; // Tableau pour stocker les segments du serpent
let food; // Position actuelle de la nourriture
let animationFrameId; // Identifiant pour l'animation
let lastTime = 0; // Temps de la dernière mise à jour
let direction = "RIGHT"; // Direction initiale du serpent
let score = 0; // Score initial
let isPaused = false; // Indique si le jeu est en pause

  startGame(); // Démarre le jeu

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

/**
 * Initialise les variables et démarre le jeu.
 */
function startGame() {
  snake = initSnake(); // Initialise le serpent avec sa position de départ
  food = generateFood(box, canvas); // Génère la nourriture à une position aléatoire
  score = 0; // Réinitialise le score
  direction = "RIGHT"; // Réinitialise la direction initiale
  scoreBoard.textContent = score;
  isPaused = false;
  // Démarre la boucle de mise à jour
  startTimer();
  update();
}
function restartGame() {
  startGame(); // Redémarre le jeu en appelant la fonction startGame
}
// Fonction pour mettre le jeu en pause ou reprendre
function togglePause() {
  if (!isPaused) {
      isPaused = true;
      cancelAnimationFrame(animationFrameId); // Arrête l'animation
      drawPauseOverlay(canvas, ctx); // Affiche l'overlay de pause
  } else {
      isPaused = false;
      update(); // Reprend le jeu
  }
}
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
      togglePause(); // Active/désactive la pause
  } else {
      direction = handleDirectionChange(event, direction);
  }
});

/**
 * Met à jour l'état du jeu à chaque cycle.
 *
 * @param {number} currentTime - Temps actuel en millisecondes, fourni par `requestAnimationFrame`.
 */
function update(currentTime) {
  if (isPaused) return;
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
  if (checkFoodCollision(head, food)) {
    score++; // Incrémente le score
    if(gameSpeed >= 50)
    gameSpeed -= 10;
    scoreBoard.textContent = score; // Met à jour le texte affiché
    food = generateFood( box, canvas); // Génère une nouvelle nourriture
  } else {
    snake.pop(); // Retire le dernier segment si pas de nourriture mangée
  }
  // Vérifie les collisions : avec les murs ou le corps du serpent
  if (checkCollision(head, snake) || checkWallCollision(head, canvas)) {
    cancelAnimationFrame(animationFrameId); // Arrête l'animation
    drawGameOverMenu(canvas, ctx, score, restartGame);
    return;
  }
  updateTimer();
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
  drawTimer(canvas, ctx);
}