// menu.js

// Affiche le menu principal
export function showMainMenu(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Main Menu", canvas.width / 2 - 80, 100);

    ctx.font = "20px Arial";
    ctx.fillText("1. Play", canvas.width / 2 - 50, 150);
    ctx.fillText("2. Library", canvas.width / 2 - 50, 180);

    ctx.fillText("Press 1 to Play, 2 to view Library", canvas.width / 2 - 150, 250);
}

// Affiche la bibliothèque des armes
export function showLibrary(ctx, canvas, currentWave) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Weapon Library", canvas.width / 2 - 100, 50);

    const weapons = [
        { name: "Pistol", unlocked: true },
        { name: "Shotgun", unlocked: currentWave >= 3 },
        { name: "Sniper", unlocked: currentWave >= 5 },
        { name: "Rocket Launcher", unlocked: currentWave >= 10 }
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

// Gère les entrées du menu
export function handleMenuInput(e, ctx, canvas, setGameState, currentWave) {
    const key = e.key.toLowerCase();

    if (key === "1") {
        setGameState("play"); // Passe en mode jeu
    } else if (key === "2") {
        setGameState("library"); // Ouvre la bibliothèque
    } else if (key === "b" && gameState === "library") {
        setGameState("main"); // Retour au menu principal
    }
}
