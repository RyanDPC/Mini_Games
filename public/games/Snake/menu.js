/**
 * Affiche un menu générique sur le canvas avec un titre, un sous-titre et une action de redémarrage.
 *
 * @param {HTMLCanvasElement} canvas - L'element canvas où le menu est affiché.
 * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas pour dessiner.
 * @param {string} title - Le titre principal du menu.
 * @param {string} subtitle - Le sous-titre ou les instructions.
 */
import { startGameAfterMenu } from "./main.js";

export function drawMenu(canvas, ctx, title, subtitle) {
    // Dessiner un fond semi-transparent
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Configurer le texte
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
  
    // Texte principal
    ctx.font = "48px Arial";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 50);
  
    // Texte secondaire
    ctx.font = "24px Arial";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 20);
  
    // Ajouter un gestionnaire pour la touche Enter
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        window.removeEventListener("keydown", handleKeyPress);
        startGameAfterMenu();
      }
    }
  
    window.addEventListener("keydown", handleKeyPress);
}

/**
 * Affiche le menu principal de démarrage.
 *
 * @param {HTMLCanvasElement} canvas - L'element canvas.
 * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas.
 * @param {Function} startGame - La fonction à appeler pour démarrer le jeu.
 */
export function drawStartMenu(canvas, ctx, startGame) {
    drawMenu(
      canvas,
      ctx,
      "Snake Game",
      "Appuyez sur 'Enter' pour commencer",
      startGame
    );
}

/**
 * Affiche le menu Game Over.
 *
 * @param {HTMLCanvasElement} canvas - L'element canvas.
 * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas.
 * @param {number} score - Le score final du joueur.
 * @param {Function} restartGame - La fonction à appeler pour redémarrer le jeu.
 */
export function drawGameOverMenu(canvas, ctx, score, restartGame) {
    drawMenu(
      canvas,
      ctx,
      "Game Over",
      `Score: ${score}\nAppuyez sur 'Enter' Apour recommencer`,
      restartGame
    );
}
