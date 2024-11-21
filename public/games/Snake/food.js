import {DrawTile} from "./main.js";

/**
 * Génère de manière aléatoire la position de la nourriture sur la grille du jeu.
 *
 * La nourriture est placée à une position aléatoire sur la grille, en s'assurant
 * que les coordonnées sont alignées sur la grille en fonction de la taille des cases (box).
 * La position générée est dans les limites du canvas, définies par sa largeur et sa hauteur.
 *
 * @param {number} box - La taille d'une case de la grille en pixels.
 * @param {HTMLCanvasElement} canvas - L'élément canvas représentant la surface de jeu.
 * @returns {{x: number, y: number}} - Un objet contenant les coordonnées `x` et `y` de la nourriture générée.
 */
function generateFood(snake, box, canvas) {
  let food;
  let collision;
  do {
    collision = false;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
    // Vérifie si la nourriture apparaît sur le serpent
    collision = snake.some(segment => segment.x === food.x && segment.y === food.y);
  } while (collision);
  return food;
}

/**
 * Vérifie si la tête du serpent a mangé la nourriture et met à jour le jeu.
 *
 * Cette fonction compare la position de la tête du serpent avec celle de la nourriture.
 * Si elles coïncident, le score est incrémenté, la nourriture est régénérée à une nouvelle position,
 * et la vitesse du jeu est ajustée en fonction du score.
 *
 * @param {Array<{x: number, y: number}>} snake - Le serpent représenté par un tableau de segments.
 * @param {{x: number, y: number}} food - L'objet représentant la position actuelle de la nourriture.
 * @param {number} box - La taille d'une case de la grille en pixels.
 * @param {HTMLCanvasElement} canvas - L'élément canvas représentant la surface de jeu.
 * @param {number} score - Le score actuel du joueur.
 * @param {number} gameSpeed - La vitesse actuelle du jeu (en millisecondes entre les mises à jour).
 * @returns {{food: {x: number, y: number}, score: number, gameSpeed: number}} - Un objet contenant la nourriture, le score, et la vitesse mis à jour.
 */
function CheckFood(snake, food, box, canvas, score, gameSpeed) {
  // Récupère la position de la tête du serpent.
  let head = snake[0];

  // Vérifie si la tête du serpent est à la même position que la nourriture.
  if (head.x === food.x && head.y === food.y) {
    console.log("Le serpent a mangé la nourriture !");

    // Génère une nouvelle position pour la nourriture.
    food = generateFood(snake, box, canvas);

    // Incrémente le score.
    score++;

    // Augmente la vitesse du jeu en réduisant l'intervalle, avec une limite minimale de 100 ms.
    gameSpeed = Math.max(100, 400 - score * 10);

    console.log("Vitesse Actuelle : ", gameSpeed);
  }

  // Retourne les mises à jour pour la nourriture, le score, et la vitesse du jeu.
  return { food, score, gameSpeed };
}

/**
 * Dessine la nourriture sur le canvas à la position spécifiée.
 *
 * Cette fonction utilise le contexte de rendu pour dessiner un rectangle représentant
 * la nourriture à l'emplacement indiqué par les coordonnées `x` et `y`. La taille du rectangle
 * est déterminée par la taille d'une case (box) sur la grille.
 *
 * @param {{x: number, y: number}} food - Un objet contenant les coordonnées `x` et `y` où la nourriture doit être dessinée.
 */
function drawFood(food) {
  // Utilise la fonction DrawTile pour dessiner la nourriture en rouge à la position spécifiée.
  DrawTile(food.x, food.y, "red");
}

export { generateFood, CheckFood, drawFood };
