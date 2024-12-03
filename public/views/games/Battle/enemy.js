// enemy.js
const canvas = document.getElementById('gameCanvas');

// Classe de base Enemy
export class Enemy {
    constructor(x, y, width, height, speed, color, health) {
        this.x = x;  // Position initiale X
        this.y = y;  // Position initiale Y
        this.width = width;  // Largeur de l'ennemi
        this.height = height;  // Hauteur de l'ennemi
        this.speed = speed;  // Vitesse de l'ennemi
        this.color = color;  // Couleur de l'ennemi
        this.health = health;  // Santé de l'ennemi
        this.size = Math.max(width, height) / 2;  // Rayon de l'ennemi pour la détection de collision
    }

    // Mise à jour de la position de l'ennemi
    update() {
        // Logique de déplacement (exemple simple de mouvement horizontal)
        this.x += this.speed;

        // Si l'ennemi atteint les bords du canvas, il change de direction
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.speed = -this.speed;  // Change de direction
        }
    }

    // Dessine l'ennemi sur le canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Applique les dégâts à l'ennemi (si sa santé est > 0)
    takeDamage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.die();  // L'ennemi meurt si sa santé atteint 0
        }
    }

    // Gère la mort de l'ennemi (par exemple, il peut être retiré de l'écran)
    die() {
        console.log("Ennemi détruit !");
        // Code pour retirer l'ennemi du jeu (par exemple, le retirer du tableau des ennemis)
    }

    // Vérifie si un projectile entre en collision avec l'ennemi
    checkBulletCollision(bullets) {
        bullets.forEach(bullet => {
            // Vérifie si la balle touche l'ennemi
            const dist = Math.hypot(this.x + this.width / 2 - bullet.x, this.y + this.height / 2 - bullet.y);
            if (dist < this.size + bullet.size) {
                this.takeDamage(bullet.damage);  // Applique les dégâts si collision
                bullet.destroy();  // Détruit la balle après la collision
            }
        });
    }
}

// Ennemi de type "Scavenger" (mob rapide, faible en santé)
export class Scavenger extends Enemy {
    constructor(x, y) {
        super(x, y, 20, 20, 4, 'green', 50);
    }

    update() {
        // Se déplace de manière aléatoire (logique simple)
        this.x += Math.random() * this.speed - this.speed / 2;
        this.y += Math.random() * this.speed - this.speed / 2;

        // Empêche l'ennemi de sortir du canvas
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }
}

// Ennemi de type "Brute" (lent mais très résistant)
export class Brute extends Enemy {
    constructor(x, y) {
        super(x, y, 30, 30, 1, 'red', 150);
    }

    update(player) {
        // Se déplace lentement vers le joueur
        this.x += Math.sign(player.x - this.x) * this.speed;
        this.y += Math.sign(player.y - this.y) * this.speed;

        // Empêche l'ennemi de sortir du canvas
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }
}

// Ennemi de type "Shooter" (tire des projectiles sur le joueur)
export class Shooter extends Enemy {
    constructor(x, y) {
        super(x, y, 20, 20, 2, 'blue', 80);
        this.lastShotTime = 0;  // Temps du dernier tir
        this.shootCooldown = 1000;  // Temps entre deux tirs (en millisecondes)
    }

    update(player, bullets, currentTime) {
        // Déplacement de l'ennemi (vers le joueur dans cet exemple)
        this.x += Math.sign(player.x - this.x) * this.speed;
        this.y += Math.sign(player.y - this.y) * this.speed;

        // Empêche l'ennemi de sortir du canvas
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));

        // Gérer le tir si le cooldown est terminé
        if (currentTime - this.lastShotTime > this.shootCooldown) {
            this.shoot(bullets);  // L'ennemi tire un projectile
            this.lastShotTime = currentTime;  // Met à jour le temps du dernier tir
        }
    }

    shoot(bullets) {
        const bulletSpeed = 5;
        // Créer un projectile et l'ajouter à la liste des projectiles
        const bullet = {
            x: this.x + this.width / 2,  // La balle part du centre de l'ennemi
            y: this.y + this.height / 2,
            width: 10,
            height: 10,
            speed: bulletSpeed,
            damage: 20,
            directionX: Math.sign(player.x - this.x) * bulletSpeed,
            directionY: Math.sign(player.y - this.y) * bulletSpeed,
            size: 10,  // Rayon de la balle pour la détection de collision
            destroy() {
                console.log("Projectile destroyed");
                // Code pour détruire le projectile
            },
        };
        bullets.push(bullet);  // Ajouter le projectile à la liste des projectiles
    }
}
