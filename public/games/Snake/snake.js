/**
 * Initialise le serpent au début du jeu.
 *
 * Cette fonction crée le serpent en tant que tableau contenant un seul segment,
 * positionné à une position de départ définie sur la grille.
 *
 * @returns {Array<{x: number, y: number}>} - Un tableau contenant un objet représentant la position du premier segment du serpent.
 */
import { generateFood } from "./food.js";
import {DrawTile} from "./main.js";

function initSnake() {
  // A compléter
  return [{ x: 200, y: 180 }];
}

/**
 * Déplace le serpent dans la direction actuelle.
 *
 * Cette fonction calcule la nouvelle position de la tête du serpent en fonction
 * de la direction actuelle (gauche, haut, droite, bas). Le reste du corps du serpent
 * suit la tête. La fonction retourne un objet représentant la nouvelle position de la tête du serpent.
 *
 * @param {Array<{x: number, y: number}>} snake - Le tableau représentant le serpent, où chaque élément est un segment avec des coordonnées `x` et `y`.
 * @param {string} direction - La direction actuelle du mouvement du serpent ("LEFT", "UP", "RIGHT", ou "DOWN").
 * @param {number} box - La taille d'une case de la grille en pixels, utilisée pour déterminer la distance de déplacement du serpent.
 * @param {{x: number, y: number}} food - Objet représentant les coordonnées `x` et `y` de la nourriture.
 * @param {number} score - Le score actuel.
 * @param {HTMLCanvasElement} canvas - Élément canvas représentant la surface de jeu.
 * @returns {{snake: Array<{x: number, y: number}>, food: {x: number, y: number}, score: number}} - Un objet contenant les nouvelles coordonnées du serpent, la nourriture et le score.
 */
function moveSnake(snake, direction, box) {
  
  const newHead = { x: snake[0].x, y: snake[0].y };

  switch (direction) {
    case "LEFT":
      newHead.x -= box;
      break;
    case "UP":
      newHead.y -= box;
      break;
    case "RIGHT":
      newHead.x += box;
      break;
    case "DOWN":
      newHead.y += box;
      break;
    }
    snake.unshift(newHead);

    return{newHead};
}

/**
 * Dessine le serpent sur le canvas.
 *
 * Cette fonction parcourt chaque segment du serpent et le dessine sur le canvas en utilisant
 * un rectangle coloré. La tête du serpent est dessinée dans une couleur différente des autres segments
 * pour la distinguer visuellement. Chaque segment est dessiné à sa position actuelle sur la grille,
 * avec une taille déterminée par la valeur de `box`.
 *
 * @param {CanvasRenderingContext2D} ctx - Le contexte de rendu 2D du canvas utilisé pour dessiner.
 * @param {Array<{x: number, y: number}>} snake - Un tableau représentant le serpent, où chaque élément est un segment avec des coordonnées `x` et `y`.
 * @param {number} box - La taille d'une case de la grille en pixels, utilisée pour déterminer la taille de chaque segment du serpent.
 */
function drawSnake(snake) {
  // A compléter
  for (let i = 0; i < snake.length; i++){
    if(i=== 0 ){
      DrawTile(snake[i].x, snake[i].y, "green");
    }
    else{
      DrawTile(snake[i].x, snake[i].y, "lightgreen");
    }
  }
  
}
export { initSnake, moveSnake, drawSnake };