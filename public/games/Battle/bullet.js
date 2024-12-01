export class Bullet {
    constructor(x, y, angle, speed, damage, size, color, range, isExplosive = false) {
        this.x = x;  // Position initiale X
        this.y = y;  // Position initiale Y
        this.angle = angle;  // Angle de tir
        this.speed = speed;  // Vitesse du projectile
        this.damage = damage;  // Dégâts infligés
        this.size = size;  // Taille du projectile
        this.color = color;  // Couleur du projectile
        this.range = range;  // Portée maximale
        this.isExplosive = isExplosive;  // Si le projectile est explosif
        this.distanceTraveled = 0;  // Distance parcourue par le projectile
    }

    // Met à jour la position du projectile
    update() {
        const deltaX = Math.cos(this.angle) * this.speed;
        const deltaY = Math.sin(this.angle) * this.speed;

        this.x += deltaX;
        this.y += deltaY;
        this.distanceTraveled += this.speed;

        // Vérifie si le projectile dépasse sa portée maximale
        if (this.distanceTraveled > this.range) {
            this.destroy();
        }
    }

    // Dessine le projectile sur le canvas
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Vérifie si le projectile touche un ennemi
    checkCollision(enemies) {
        enemies.forEach(enemy => {
            // Calcul de la distance entre le projectile et l'ennemi
            const dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);

            if (dist < this.size + enemy.size) {
                this.handleHit(enemy);
            }
        });
    }

    // Gère les effets de l'impact avec un ennemi
    handleHit(enemy) {
        enemy.takeDamage(this.damage);  // Applique les dégâts à l'ennemi

        // Si le projectile est explosif, exécute l'explosion
        if (this.isExplosive) {
            this.explode(enemy);
        }

        this.destroy();  // Détruire la balle après l'impact
    }

    // Exécute l'explosion (si le projectile est explosif)
    explode(enemy) {
        console.log("Explosion déclenchée à", enemy.x, enemy.y);

        // Utiliser un ensemble (Set) pour suivre les ennemis déjà affectés par cette explosion
        const affectedEnemies = new Set();

        // Recherche des ennemis à proximité
        const affected = enemies.filter(e => Math.hypot(e.x - enemy.x, e.y - enemy.y) < this.size + 50);  // Rayon d'effet de 50
        affected.forEach(affectedEnemy => {
            // Éviter les effets multiples sur le même ennemi
            if (!affectedEnemies.has(affectedEnemy)) {
                affectedEnemies.add(affectedEnemy);  // Marque l'ennemi comme affecté
                affectedEnemy.takeDamage(this.damage);  // Applique les dégâts à tous les ennemis dans la zone
            }
        });
    }

    // Détruire la balle (ne plus l'afficher et l'enlever des projectiles en jeu)
    destroy() {
        console.log("Balle détruite");
        // Retirer cette balle du tableau des projectiles actifs
        const index = activeProjectiles.indexOf(this);
        if (index !== -1) {
            activeProjectiles.splice(index, 1);  // Retirer le projectile de la liste
        }
    }
}
