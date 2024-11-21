// bullet.js

export class Bullet {
    constructor(x, y, angle, speed, color, size) {
        this.x = x; // Position X
        this.y = y; // Position Y
        this.angle = angle; // Angle de tir
        this.speed = speed; // Vitesse du projectile
        this.color = color; // Couleur du projectile
        this.size = size; // Taille du projectile
    }

    // Mettre à jour la position du projectile
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    // Dessiner le projectile sur le canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Vérifie si la balle est sortie de l'écran
    isOutOfBounds(canvas) {
        return (
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height
        );
    }
}
