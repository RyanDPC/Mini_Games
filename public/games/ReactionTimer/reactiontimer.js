const clickArea = document.querySelector(".click-area");
const displayText = document.querySelector(".display-text");
const bestTimeSpan = document.getElementById("best-time");
const averageTimeSpan = document.getElementById("average-time");
const attemptsSpan = document.getElementById("attempts");

const scoreHistory = [];

const MINIMUM_MS_TILL_CHANGE = 3000;
const MAXIMUM_MS_TILL_CHANGE = 10000;

let msSinceEpochOnTimeout = 0;
let waitingForClick = false;

let bestTime = null;
let totalTime = 0;
let attempts = 0;

function play() {
  const msTillChange =
    Math.floor(
      Math.random() * (MAXIMUM_MS_TILL_CHANGE - MINIMUM_MS_TILL_CHANGE)
    ) + MINIMUM_MS_TILL_CHANGE;

  // Revert the colour back to red
  clickArea.style.backgroundColor = "red";

  displayText.textContent = "";

  setTimeout(() => {
    msSinceEpochOnTimeout = Date.now();

    clickArea.style.backgroundColor = "#009578"; // Green
    waitingForClick = true;
  }, msTillChange);
}

function addScore(score) {
  // Update best time
  if (bestTime === null || score < bestTime) {
    bestTime = score;
    bestTimeSpan.textContent = `${bestTime}`;
  }

  // Update attempts and total time
  attempts++;
  totalTime += score;

  // Calculate average
  const averageTime = Math.round(totalTime / attempts);

  // Update UI
  averageTimeSpan.textContent = `${averageTime}`;
  attemptsSpan.textContent = attempts;
}

clickArea.addEventListener("click", () => {
  if (waitingForClick) {
    const score = Date.now() - msSinceEpochOnTimeout;

    waitingForClick = false;
    displayText.textContent = `Votre temps était de ${score} ms ! Cliquez pour rejouer.`;

    addScore(score);
  } else {
    play();
  }
});
