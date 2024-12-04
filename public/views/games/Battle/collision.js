// collisions.js

import { Quadtree, Rectangle } from './quadtree.js';

// Définir les limites du quadtree
const bounds = new Rectangle(0, 0, 500, 500);  // Ajustez les valeurs selon la taille de votre canvas
const max_objects = 4;
const quadtree = new Quadtree(bounds, max_objects);

// Fonction pour ajouter des objets au quadtree
function populateQuadtree(player, enemies, bullets) {
    quadtree.insert(player);
    enemies.forEach(enemy => quadtree.insert(enemy));
    bullets.forEach(bullet => {
        if (bullet && typeof bullet.update === 'function') {
            quadtree.insert(bullet);
        }
    });
}

// Récupérer les objets potentiellement en collision
export function checkCollisions(player, enemies, bullets) {
    // Réinitialiser le quadtree à chaque mise à jour
    quadtree.points = [];
    populateQuadtree(player, enemies, bullets);

    const potentialCollisions = quadtree.query(bounds);
    potentialCollisions.forEach(obj => {
        if (isColliding(player, obj)) {
            handleCollision(player, obj);
        }
    });
}

// Fonction pour vérifier les collisions entre le joueur et un tableau d'ennemis
export function checkPlayerEnemyCollision(player, enemies) {
    enemies.forEach(enemy => {
        if (isColliding(player, enemy)) {
            handleCollision(player, enemy);
        }
    });
}

// Fonction pour vérifier les collisions entre un tableau de balles et un tableau d'ennemis
export function checkBulletEnemyCollision(bullets, enemies) {
    bullets.forEach((bullet, bulletIndex) => {
        if (bullet && typeof bullet.update === 'function') {
            enemies.forEach((enemy, enemyIndex) => {
                if (isColliding(bullet, enemy)) {
                    handleBulletCollision(bullet, enemy);
                    // Supprimer la balle une fois la collision détectée
                    bullets.splice(bulletIndex, 1);
                }
            });
        }
    });
}

// Fonction pour vérifier les collisions entre un tableau de balles et le joueur
export function checkBulletPlayerCollision(bullets, player) {
    bullets.forEach((bullet, bulletIndex) => {
        if (bullet && typeof bullet.update === 'function') {
            if (isColliding(bullet, player)) {
                handleBulletPlayerCollision(bullet, player);
                // Supprimer la balle une fois la collision détectée
                bullets.splice(bulletIndex, 1);
            }
        }
    });
}

function isColliding(obj1, obj2) {
    const dist = Math.hypot((obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2), 
                            (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2));
    return dist < (obj1.size + obj2.size);
}

// Fonction pour gérer la collision entre le joueur et un ennemi
function handleCollision(player, enemy) {
    console.log(`Collision detected between player at (${player.x}, ${player.y}) and enemy at (${enemy.x}, ${enemy.y})`);
    // Exemple d'effet de collision :
    player.takeDamage(10);  // Réduit la vie du joueur
    enemy.takeDamage(20);  // Réduit la vie de l'ennemi
}

// Fonction pour gérer la collision entre une balle et un ennemi
function handleBulletCollision(bullet, enemy) {
    console.log(`Bullet collision detected at (${bullet.x}, ${bullet.y}) with enemy at (${enemy.x}, ${enemy.y})`);
    // Exemple d'effet de collision :
    enemy.takeDamage(bullet.damage);  // Réduit la vie de l'ennemi
}

// Fonction pour gérer la collision entre une balle et le joueur
function handleBulletPlayerCollision(bullet, player) {
    console.log(`Bullet collision detected at (${bullet.x}, ${bullet.y}) with player at (${player.x}, ${player.y})`);
    // Exemple d'effet de collision :
    player.takeDamage(bullet.damage);  // Réduit la vie du joueur
}
