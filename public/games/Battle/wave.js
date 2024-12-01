import { Scavenger, Brute, Shooter } from './enemy.js';
import { checkSpecialityUnlock } from './speciality.js';

export class Wave {
    constructor(waveNumber, canvas, player) {
        this.waveNumber = waveNumber;
        this.enemies = [];  
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = player; // Le joueur est maintenant un attribut de la vague
        this.spawnEnemies();  // Lancer la génération des ennemis pour cette vague
        this.waveFinished = false; // Ajouter un attribut pour gérer si la vague est finie
    }

    // Fonction pour déclencher une explosion
    triggerExplosion(x, y, radius, damage, enemies) {
        enemies.forEach(enemy => {
            const dist = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
            if (dist < radius) {
                enemy.health -= damage; // Applique les dégâts aux ennemis proches
            }
        });
    }

    // Fonction pour créer des ennemis
    spawnEnemies() {
        const numEnemies = this.waveNumber * 5;  // Augmente le nombre d'ennemis par vague
        for (let i = 0; i < numEnemies; i++) {
            let x = Math.random() * this.canvas.width;
            let y = Math.random() * this.canvas.height;
            let enemy;
    
            // Ajout de la logique pour plus de variété
            if (this.waveNumber <= 3) {
                enemy = new Scavenger(x, y);
            } else if (this.waveNumber <= 6) {
                enemy = Math.random() < 0.7 ? new Scavenger(x, y) : new Brute(x, y);
            } else {
                let randomType = Math.random();
                if (randomType < 0.5) {
                    enemy = new Scavenger(x, y);
                } else if (randomType < 0.8) {
                    enemy = new Brute(x, y);
                } else {
                    enemy = new Shooter(x, y);
                }
            }
    
            this.enemies.push(enemy);
        }
    }
    
    // Mettre à jour les ennemis
    update() {
        this.enemies.forEach(enemy => enemy.update());  // Mettre à jour les ennemis
    }

    // Dessiner les ennemis
    draw() {
        this.enemies.forEach(enemy => enemy.draw(this.ctx));  // Dessiner les ennemis
    }

    // Vérifier et supprimer les ennemis morts
    checkForDeadEnemies() {
        this.enemies = this.enemies.filter(enemy => enemy.health > 0);  // Supprimer les ennemis morts
    }

    // Vérifier les spécialités de la vague
    checkWaveSpecialties() {
        if (this.waveNumber === 3) {
            this.triggerExplosion(this.player.x, this.player.y, 100, 50, this.enemies); // Déclencher l'explosion
        }
    }

    // Gérer la vague entière (mise à jour, dessin, vérification des ennemis morts et des spécialités)
    manageWave() {
        this.update();  // Mettre à jour la vague
        this.draw();  // Dessiner les ennemis
        this.checkForDeadEnemies();  // Vérifier les ennemis morts
        this.checkWaveSpecialties();  // Vérifier les spécialités de la vague
        if (this.player && typeof this.player.checkSpecialities === 'function') {
            this.player.checkSpecialities();  // Vérifie et applique les spécialisations
        }  // Vérifier les passifs du joueur
    
        // Si la vague est terminée, attendre quelques secondes avant de passer à la suivante
        if (this.enemies.length === 0 && !this.waveFinished) {
            this.waveFinished = true;
            setTimeout(() => {
                this.waveNumber++;
                this.spawnEnemies();
                this.waveFinished = false;
            }, 3000);  // Attendre 3 secondes avant de passer à la vague suivante
        }
    }
}
