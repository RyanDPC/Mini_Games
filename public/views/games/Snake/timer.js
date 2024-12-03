let startTime = null;
let elapsedTime = 0;

export function startTimer() {
  startTime = Date.now(); // Enregistre le temps de départ
}

export function updateTimer(timer) {
    elapsedTime = Date.now() - startTime;  // Met à jour elapsedTime globalement
    timer = Math.floor(elapsedTime / 1000); // Met à jour timer en secondes
  }
  

export function getFormattedTime() {
  // Convertit le temps écoulé en secondes et minutes
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / 60000) % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Format MM:SS
}
export function drawTimer(canvas, ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    const timerText = getFormattedTime(); // Récupère le temps formaté
    ctx.fillText("Time: " + timerText, canvas.width - 100, 20); // Affiche à 120px du bord droit
  }