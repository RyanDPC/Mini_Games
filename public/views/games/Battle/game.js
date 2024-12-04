// game.js

import { checkPlayerEnemyCollision, checkBulletEnemyCollision, checkBulletPlayerCollision } from './collision.js';
import { Player } from './player.js';
import { Enemy, Scavenger, Brute, Shooter } from './enemy.js';
import { Bullet, drawBullet } from './bullet.js';

// Variables globales
let canvas, ctx;
let player;
let enemies = [];
let bullets = [];
let keys = {};

// Initialisation du jeu
// Initialisation du jeu
function init() {
    player = new Player('Player1', 100, 3, 20, 1500);
    player.lives = 3;  // Ajouter 3 vies au joueur
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Créer le joueur
    player = new Player('Player1', 100, 3, 20, 1500);

    // Créer des ennemis de différents types
    enemies.push(new Scavenger(100, 100, canvas));
    enemies.push(new Brute(200, 200, canvas));
    enemies.push(new Shooter(300, 300, canvas));

    // Gestion des entrées clavier
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);

    // Lancer la boucle de jeu
    requestAnimationFrame(gameLoop);
}

// Boucle de jeu principale
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mise à jour des éléments du jeu
function update() {
    // Mettre à jour la position du joueur
    player.move(keys);
    
    // Empêcher le joueur de sortir du canvas
    keepInBounds(player);

   
 // Mettre à jour les balles tirées par les ennemis
 enemies.forEach(enemy => {
    if (enemy instanceof Shooter && enemy.bullets) {
        enemy.bullets.forEach((bullet, bulletIndex) => {
            bullet.x += bullet.directionX;
            bullet.y += bullet.directionY;
            // Supprimer la balle si elle sort du canvas
            if (!isInBounds(bullet)) {
                enemy.bullets.splice(bulletIndex, 1);
            }
        });
    }
});
    // Mettre à jour les balles
    bullets.forEach((bullet, bulletIndex) => {
        if (typeof bullet.update === 'function') {
            bullet.update();
            // Supprimer la balle si elle sort du canvas ou dépasse sa portée
            if (!isInBounds(bullet) || bullet.distanceTraveled > bullet.range) {
                bullets.splice(bulletIndex, 1);
            }
        }
    });
   // Mettre à jour les ennemis 
   enemies.forEach(enemy => { 
    if (enemy instanceof Shooter) { 
        enemy.update(player, bullets, Date.now()); 
    } else { enemy.update(player); } 
        // Empêcher les ennemis de sortir du canvas
        keepInBounds(enemy);
    });
    // Vérifier les collisions
    checkPlayerEnemyCollision(player, enemies);
    checkBulletEnemyCollision(bullets, enemies);
    enemies.forEach(enemy => {
        if (enemy instanceof Shooter && enemy.bullets) {
            checkBulletPlayerCollision(enemy.bullets, player);
        }
    });
     // Gérer la perte de vie du joueur
     if (player.collided) {
        player.lives -= 1;
        player.collided = false;
        console.log(`Le joueur a ${player.lives} vies restantes.`);
        if (player.lives <= 0) {
            console.log('Le joueur a perdu toutes ses vies. Réinitialisation du jeu.');
            resetGame();
        }
    }
}

// Dessiner les éléments du jeu
function draw() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    player.draw(ctx);

    // Vérifier et appliquer les spécialisations du joueur
    player.checkSpecialities();
    // Dessiner les ennemis
    enemies.forEach(enemy => enemy.draw(ctx));

    // Dessiner les balles
    bullets.forEach(bullet => {
        if (bullet && bullet.size > 0) {
            drawBullet(ctx, bullet);
        }
    });
     // Dessiner les balles tirées par les ennemis
    enemies.forEach(enemy => {
        if (enemy instanceof Shooter && enemy.bullets) {
            enemy.bullets.forEach(bullet => {
                drawBullet(ctx, bullet);
            });
        }
    });
}
// Fonction pour réinitialiser le jeu
function resetGame() {
    player = new Player('Player1', 100, 3, 20, 1500);
    player.lives = 3;
    enemies = [];
    bullets = [];
    enemies.push(new Scavenger(100, 100, canvas));
    enemies.push(new Brute(200, 200, canvas));
    enemies.push(new Shooter(300, 300, canvas));
    console.log('Jeu réinitialisé.');
}
// Fonction pour tirer un projectile
function shootBullet() {
    const bullet = new Bullet(player.x + player.width / 2 - 2.5, player.y - 10, -Math.PI / 2, 5, player.damage, 5, 'yellow', 500);
    bullets.push(bullet);
    console.log('Le tir a été fait');
}
// Fonction pour garder un objet dans les limites du canvas
function keepInBounds(obj) {
    obj.x = Math.max(0, Math.min(obj.x, canvas.width - obj.width));
    obj.y = Math.max(0, Math.min(obj.y, canvas.height - obj.height));
}

// Fonction pour vérifier si un objet est dans les limites du canvas
function isInBounds(obj) {
    return obj.x >= 0 && obj.x + obj.size <= canvas.width && obj.y >= 0 && obj.y + obj.size <= canvas.height;
}

// Gestion des tirs du joueur
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        shootBullet();
    }
});

// Lancer l'initialisation lorsque la page est chargée
window.onload = init;
