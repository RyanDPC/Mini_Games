// enemy.js

// Définition de la classe Enemy
export class Enemy {
    constructor(x, y, width, height, speed, color) {
        this.x = x; // Position X
        this.y = y; // Position Y
        this.width = width; // Largeur de l'ennemi
        this.height = height; // Hauteur de l'ennemi
        this.speed = speed; // Vitesse de déplacement
        this.color = color; // Couleur de l'ennemi
    }

    // Déplace l'ennemi vers le joueur
    moveTowards(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distance est non nulle, déplacer l'ennemi
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    // Dessine l'ennemi sur le canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Fonction pour générer des ennemis
export function spawnEnemies(wave, canvas, player) {
    const enemies = [];
    const minDistance = 200; // Distance minimale entre le joueur et les ennemis
    const enemySize = 20; // Taille des ennemis

    for (let i = 0; i < wave; i++) {
        let enemy;
        let validPosition = false;

        // Générer une position valide pour l'ennemi
        while (!validPosition) {
            enemy = new Enemy(
                Math.random() * (canvas.width - enemySize), // Position X aléatoire (éviter les bords)
                Math.random() * (canvas.height - enemySize), // Position Y aléatoire (éviter les bords)
                enemySize, // Largeur de l'ennemi
                enemySize, // Hauteur de l'ennemi
                1 + wave * 0.1, // Vitesse (augmente avec la vague)
                'red' // Couleur de l'ennemi
            );

            // Vérifie si l'ennemi est suffisamment loin du joueur
            const distanceToPlayer = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            let isFarFromOthers = true;

            // Vérifie si l'ennemi est suffisamment loin des autres ennemis
            for (const otherEnemy of enemies) {
                const distanceToOther = Math.hypot(enemy.x - otherEnemy.x, enemy.y - otherEnemy.y);
                if (distanceToOther < enemySize * 2) {
                    isFarFromOthers = false;
                    break;
                }
            }

            if (distanceToPlayer >= minDistance && isFarFromOthers) {
                validPosition = true;
            }
        }

        enemies.push(enemy);
    }

    return enemies; // Retourne la liste des ennemis générés
}
