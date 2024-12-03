import { getPlayerByType } from './player.js';  // Importer la fonction pour récupérer un joueur
import { getWeapon } from './weapon.js';  // Importer la fonction pour récupérer une arme
import {startGame } from './game.js';
let currentGameState = "main";  // Valeur initiale : menu principal
let selectedPlayer = null;  // Le joueur actuellement sélectionné
let unlockedWeapons = [];  // Tableau pour suivre les armes débloquées

const challenges = [
    { wave: 5, weapon: "shotgun" },
    { wave: 10, weapon: "assaultRifle" },
    { wave: 15, weapon: "sniper" },
    { wave: 20, weapon: "rocketLauncher" }
];

function isWeaponUnlocked(weapon, currentWave) {
    const challenge = challenges.find(challenge => challenge.weapon === weapon);
    return challenge ? currentWave >= challenge.wave : false;
}

export function showMainMenu(ctx, canvas) {
    console.log("Main Menu is displayed");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Main Menu", canvas.width / 2 - 80, 100);

    ctx.font = "20px Arial";
    ctx.fillText("1. Play", canvas.width / 2 - 50, 150);
    ctx.fillText("2. Library", canvas.width / 2 - 50, 180);
    ctx.fillText("3. Select Player", canvas.width / 2 - 50, 210);

    ctx.fillText("Press 1 to Play, 2 to view Library, 3 to select player", canvas.width / 2 - 150, 250);
}

export function showLibrary(ctx, canvas, currentWave) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Weapon Library", canvas.width / 2 - 100, 50);

    const weapons = [
        { name: "Pistol", unlocked: true },
        { name: "Shotgun", unlocked: isWeaponUnlocked("shotgun", currentWave) },
        { name: "Assault Rifle", unlocked: isWeaponUnlocked("assaultRifle", currentWave) },
        { name: "Sniper", unlocked: isWeaponUnlocked("sniper", currentWave) },
        { name: "Rocket Launcher", unlocked: isWeaponUnlocked("rocketLauncher", currentWave) }
    ];

    weapons.forEach((weapon, index) => {
        ctx.fillStyle = weapon.unlocked ? "green" : "gray";
        ctx.fillText(
            `${weapon.name} - ${weapon.unlocked ? "Unlocked" : "Locked"}`,
            100,
            100 + index * 30
        );
    });

    ctx.fillStyle = "black";
    ctx.fillText("Press B to return to main menu", 100, canvas.height - 50);
}

export function showPlayerSelection(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Select Player", canvas.width / 2 - 90, 100);

    ctx.font = "20px Arial";
    ctx.fillText("1. Warrior", canvas.width / 2 - 50, 150);
    ctx.fillText("2. Scout", canvas.width / 2 - 50, 180);
    ctx.fillText("3. Tank", canvas.width / 2 - 50, 210);
    ctx.fillText("4. Sniper", canvas.width / 2 - 50, 240);
    ctx.fillText("5. Medic", canvas.width / 2 - 50, 270);

    ctx.fillText("Press 1-5 to select a player, B to return", canvas.width / 2 - 150, canvas.height - 50);
}

// Mettre à jour l'état du jeu en fonction de l'entrée
export function handleMenuInput(e) {
    if (e.key === "1") {
         startGame(); // Changer l'état pour démarrer le jeu
    } else if (e.key === "2") {
        currentGameState = "library";  // Aller à la bibliothèque
    } else if (e.key === "3") {
        currentGameState = "playerSelection";  // Aller à la sélection du joueur
    } else if (e.key === "b" || e.key === "B") {
        currentGameState = "main";  // Revenir au menu principal
    }
}

// Exporter l'état du jeu et le joueur sélectionné
export function getCurrentGameState() {
    return currentGameState;
}

export function getSelectedPlayer() {
    return selectedPlayer;
}
