/**
 * Affiche un menu générique sur le canvas avec un titre, un sous-titre, et un bouton.
 *
 * @param {HTMLCanvasElement} canvas - L'élément canvas où le menu est affiché.
 * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas pour dessiner.
 * @param {string} title - Le titre principal du menu.
 * @param {string} subtitle - Le sous-titre ou les instructions.
 * @param {Function} buttonAction - La fonction à appeler lorsqu'on clique sur le bouton.
 */
export function drawMenu(canvas, ctx, title, subtitle, buttonAction) {
  // Dessiner un fond semi-transparent
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Configurer le texte
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  // Texte principal
  ctx.font = "48px Arial";
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 100);

  // Texte secondaire
  ctx.font = "24px Arial";
  ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 - 50);

  // Dessiner un bouton
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  const buttonY = canvas.height / 2;

  // Dessin du rectangle du bouton
  ctx.fillStyle = "white";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  // Texte du bouton
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Restart", canvas.width / 2, buttonY + buttonHeight / 2 + 7);

  // Ajouter un gestionnaire de clic pour le bouton
  function handleMouseClick(event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (
          mouseX >= buttonX &&
          mouseX <= buttonX + buttonWidth &&
          mouseY >= buttonY &&
          mouseY <= buttonY + buttonHeight
      ) {
          canvas.removeEventListener("click", handleMouseClick);
          buttonAction();
      }
  }

  canvas.addEventListener("click", handleMouseClick);
}

/**
* Affiche le menu Game Over avec un bouton Restart.
*
* @param {HTMLCanvasElement} canvas - L'élément canvas.
* @param {CanvasRenderingContext2D} ctx - Le contexte du canvas.
* @param {number} score - Le score final du joueur.
* @param {Function} restartGame - La fonction à appeler pour redémarrer le jeu.
*/
export function drawGameOverMenu(canvas, ctx, score, restartGame) {
  drawMenu(
      canvas,
      ctx,
      "Game Over",
      `Score: ${score}`,
      restartGame
  );
}

/**
* Affiche un overlay de pause sur le canvas.
*
* @param {HTMLCanvasElement} canvas - L'élément canvas.
* @param {CanvasRenderingContext2D} ctx - Le contexte du canvas.
*/
export function drawPauseOverlay(canvas, ctx) {
  // Dessiner un fond semi-transparent
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texte de pause
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "48px Arial";
  ctx.fillText("Pause", canvas.width / 2, canvas.height / 2);
}