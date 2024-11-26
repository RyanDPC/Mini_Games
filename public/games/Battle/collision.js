// collision.js

import { resetGame, resetWave } from './gameReset.js';
// Vérifie la collision entre deux rectangles
export function isRectColliding(rect1, rect2) {
    if (!rect1 || !rect2) {
        return false; // Si l'un des rectangles est indéfini, il n'y a pas de collision
    }
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Vérifie la collision d'un point avec un cercle (utile pour explosions ou projectiles)
export function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
    const dx = pointX - circleX;
    const dy = pointY - circleY;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
}

// Vérifie si deux cercles se chevauchent
export function isCircleColliding(circle1, circle2) {
    const distance = Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y);
    return distance <= (circle1.radius + circle2.radius);
}

// Gère la collision entre le joueur et un ennemi
export function handlePlayerEnemyCollision(player, enemies, initialEnemyPositions, canvas, setGameState, currentWave) {
    if (!canvas) {
        console.error("Canvas is undefined in handlePlayerEnemyCollision function");
        return;
    }
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (isRectColliding(player, enemy)) {
            console.log("Le joueur a été touché par un ennemi !");
            
            if (!player.isShielded) {
                player.health--;
                console.log(`Points de vie restants : ${player.health}`);
            }

            // Supprimer l'ennemi après la collision
            enemies.splice(i, 1);

            if (player.health > 0) {
                resetWave(enemies, initialEnemyPositions); // Réinitialiser la vague si le joueur est encore en vie
            } else {
                console.log("Le joueur a perdu toutes ses vies !");
                player.health = 3; // Réinitialiser la santé
                resetGame(player, enemies, initialEnemyPositions, canvas, setGameState, currentWave); // Réinitialiser complètement le jeu
            }

            break; // Sortir de la boucle après avoir géré la collision
        }
    }
}

// Gère les dégâts d'une explosion
export function handleExplosionDamage(x, y, radius, enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (isPointInCircle(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, x, y, radius)) {
            console.log(`Ennemi ${i} touché par l'explosion !`);
            enemies.splice(i, 1); // Supprime l'ennemi touché
        }
    }
}
