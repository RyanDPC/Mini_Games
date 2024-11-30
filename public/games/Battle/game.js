// battle.js

import { showMainMenu, showLibrary, handleMenuInput } from './menu.js';
import { Player } from './player.js';
import { Enemy, spawnEnemies } from './enemy.js';
import { getWeapon } from './weapon.js';
import { Bullet } from './bullet.js';
import { isRectColliding, handlePlayerEnemyCollision } from './collision.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const keys = {}; // Objet pour suivre les touches pressées
const bullets = [];

// Variables globales
let gameState = "main"; // "main", "play", "library"
let currentWave = 0;

// Initialisation du joueur
const player = new Player(canvas.width / 2, canvas.height / 2, 20, 20, 'green', 4);

// Initialisation des ennemis
let enemies = spawnEnemies(currentWave + 1, canvas, player); // Commence avec la première vague d'ennemis

// Positions initiales des ennemis
const initialEnemyPositions = [
    { x: 100, y: 150 },
    { x: 200, y: 150 },
    { x: 300, y: 150 }
];

// Fonction pour définir l'état du jeu
export function setGameState(state) {
    gameState = state;
}

let mouse = { x: 0, y: 0 }; // Position de la souris

// Suivre la position de la souris
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    // Calculer l'angle entre le joueur et la souris
    const dx = mouse.x - (player.x + player.width / 2);
    const dy = mouse.y - (player.y + player.height / 2);
    player.angle = Math.atan2(dy, dx); // Mettre à jour l'angle du joueur
});

window.addEventListener('mousedown', (e) => {
    if (e.button === 0 && gameState === "play") {
        const weapon = getWeapon(player.currentWeapon);

        if (player.currentWeapon === 'shotgun') {
            // Tir multiple pour le fusil à pompe
            for (let i = -1; i <= 1; i++) {
                const spreadAngle = player.angle + (i * (Math.PI / 18)); // Dispersion
                const bullet = new Bullet(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    spreadAngle,
                    weapon.bulletSpeed,
                    weapon.bulletColor,
                    weapon.bulletSize
                );
                bullets.push(bullet);
            }
        } else {
            // Tir normal pour les autres armes
            const bullet = new Bullet(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.angle,
                weapon.bulletSpeed,
                weapon.bulletColor,
                weapon.bulletSize
            );
            bullets.push(bullet);
        }
        console.log(`${weapon.name} fired!`);
    }
});

// Gestion des entrées clavier
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // Changement d'arme
    if (e.key === '1') player.switchWeapon('pistol');
    if (e.key === '2') player.switchWeapon('shotgun');
    if (e.key === '3') player.switchWeapon('sniper');

    // Gestion du menu principal ou de la bibliothèque
    if (gameState === "main" || gameState === "library") {
        handleMenuInput(e, ctx, canvas, setGameState, currentWave);
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Fonction principale de mise à jour du jeu
function gameLoop() {
    if (gameState === "main") {
        showMainMenu(ctx, canvas);
    } else if (gameState === "library") {
        showLibrary(ctx, canvas, currentWave);
    } else if (gameState === "play") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mettre à jour et dessiner les balles
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            bullet.update(); // Met à jour la position
            bullet.draw(ctx); // Dessine la balle

            // Supprime les balles hors du canvas
            if (bullet.isOutOfBounds(canvas)) {
                bullets.splice(i, 1);
                continue;
            }

            // Vérifie les collisions avec les ennemis
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (isRectColliding(
                    { x: bullet.x, y: bullet.y, width: bullet.size, height: bullet.size },
                    enemy
                )) {
                    console.log("Enemy hit!");
                    enemies.splice(j, 1); // Supprime l'ennemi
                    bullets.splice(i, 1); // Supprime la balle
                    break; // Sortir de la boucle après la suppression
                }
            }
        }

        // Vérifie les collisions entre le joueur et les ennemis
        handlePlayerEnemyCollision(player, enemies, initialEnemyPositions, canvas, setGameState, currentWave);

        // Mettre à jour le joueur et les ennemis
        player.update(keys, canvas);
        player.draw(ctx);

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy instanceof Enemy) {
                enemy.moveTowards(player);
                enemy.draw(ctx);
            }
        }

        // Vérifier si la vague est terminée
        if (enemies.length === 0 && gameState === "play") {
            currentWave++;
            console.log(`Wave ${currentWave} started!`);
            enemies = spawnEnemies(currentWave, canvas, player);
        }
    }

    requestAnimationFrame(gameLoop);
}

// Initialiser et démarrer le jeu
gameLoop();
