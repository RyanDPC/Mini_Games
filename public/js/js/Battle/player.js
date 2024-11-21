// player.js

export class Player {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.health = 3; // Santé initiale du joueur
        this.angle = 0; // Angle de rotation du joueur
        this.isShielded = false; // Indique si le joueur est protégé par un bouclier
        this.currentWeapon = "pistol"; // Arme par défaut
    }

    // Méthode pour changer d'arme
    switchWeapon(weaponName) {
        this.currentWeapon = weaponName;
        console.log(`Switched to: ${weaponName}`);
    }

    // Met à jour la position du joueur en fonction des touches pressées
    update(keys, canvas) {
        if (keys['ArrowUp'] || keys['w']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d']) this.x += this.speed;

        // Limiter le mouvement aux bords du canvas
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }

    // Dessine le joueur sur le canvas
    draw(ctx) {
        ctx.save(); // Sauvegarde le contexte

        // Déplacer et faire pivoter le contexte au centre du joueur
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        // Dessiner un triangle pour indiquer la direction du joueur
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, -this.height / 2); // Coin arrière gauche
        ctx.lineTo(this.width / 2, 0); // Pointe avant
        ctx.lineTo(-this.width / 2, this.height / 2); // Coin arrière droit
        ctx.closePath();
        ctx.fill();

        ctx.restore(); // Restaure le contexte initial
    }

    // Activer le bouclier du joueur
    activateShield(duration, reduction) {
        this.isShielded = true;
        console.log("Bouclier activé !");

        setTimeout(() => {
            this.isShielded = false;
            console.log("Bouclier désactivé !");
        }, duration);
    }

    // Effectuer un dash
    dash(speedMultiplier, duration) {
        const originalSpeed = this.speed;
        this.speed *= speedMultiplier;
        console.log("Dash activé !");

        setTimeout(() => {
            this.speed = originalSpeed;
            console.log("Dash terminé !");
        }, duration);
    }
}
