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

        console.log(`Bullet created at (${this.x}, ${this.y}) with range ${this.range}`);
    }

    // Met à jour la position du projectile
    update() {
        const deltaX = Math.cos(this.angle) * this.speed;
        const deltaY = Math.sin(this.angle) * this.speed;

        this.x += deltaX;
        this.y += deltaY;
        this.distanceTraveled += this.speed;

        console.log(`Bullet updated to position (${this.x}, ${this.y}), distance traveled: ${this.distanceTraveled}`);

        // Vérifie si le projectile dépasse sa portée maximale
        if (this.distanceTraveled > this.range) {
            console.log(`Bullet exceeded range of ${this.range}, destroying bullet.`);
            this.destroy();
        }
    }
    // Gère les effets de l'impact avec un ennemi
    handleHit(enemy) {
        console.log(`Bullet hit enemy at (${enemy.x}, ${enemy.y}), dealing ${this.damage} damage`);
        enemy.takeDamage(this.damage);  // Applique les dégâts à l'ennemi

        // Si le projectile est explosif, exécute l'explosion
        if (this.isExplosive) {
            console.log(`Bullet is explosive, triggering explosion`);
            this.explode(enemy);
        }

        this.destroy();  // Détruire la balle après l'impact
    }

    // Exécute l'explosion (si le projectile est explosif)
   // Méthode pour gérer l'explosion d'un projectile
   explode(enemies) {
    const explosionRadius = 50; // Rayon de l'explosion
    const affectedEnemies = new Set();
    enemies.forEach(enemy => {
        const distance = Math.hypot(this.x - enemy.x, this.y - enemy.y);
        if (distance < explosionRadius && !affectedEnemies.has(enemy)) {
            const damage = this.calculateDamage(distance, explosionRadius);
            enemy.takeDamage(damage);
            affectedEnemies.add(enemy);
        }
    });
}
// Méthode pour calculer les dégâts en fonction de la distance
calculateDamage(distance, radius) {
    return Math.max(0, this.damage * (1 - distance / radius));
}


    // Détruire la balle (ne plus l'afficher et l'enlever des projectiles en jeu)
    destroy() {
        console.log(`Bullet destroyed at (${this.x}, ${this.y})`);
    }
}
export function drawBullet(ctx, bullet) {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
