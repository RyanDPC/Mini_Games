import {DrawTile} from "./game.js";

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
function generateFood(box, canvas) {
  return {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}
/**
 * Dessine la nourriture sur le canvas à la position spécifiée.
 *
 * Cette fonction utilise le contexte de rendu pour dessiner un rectangle représentant
 * la nourriture à l'emplacement indiqué par les coordonnées `x` et `y`. La taille du rectangle
 * est déterminée par la taille d'une case (box) sur la grille.
 *
 * @param {{x: number, y: number}} food - Un objet contenant les coordonnées `x` et `y` où la nourriture doit être dessinée.
 */   const foodTexture = new Image();
      foodTexture.src ="apple.png";
function drawFood(food,ctx,box) {
  if (foodTexture.complete) {
    // Dessiner la texture de la nourriture si elle est prête
    ctx.drawImage(foodTexture, food.x, food.y, box, box);
  } else {
    // Si l'image n'est pas encore chargée, on peut dessiner un carré rouge temporaire
    DrawTile(ctx, food.x, food.y, "red");
  }
}

export { generateFood, drawFood };
