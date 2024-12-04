// player.js

// Classe de base Player
export class Player {
    constructor(name, health, speed, damage, reloadTime) {
        this.name = name;  // Nom du personnage
        this.health = health;  // Santé
        this.speed = speed;  // Vitesse de déplacement
        this.damage = damage;  // Dégâts infligés
        this.reloadTime = reloadTime;  // Temps de rechargement
        this.specialities = [];  // Liste des passifs du joueur
        this.maxHealth = health;  // Santé maximale (peut être augmentée par des passifs)
        this.ammo = 30;  // Munitions de départ
        this.x = 150;  // Position initiale sur l'axe X
        this.y = 100;  // Position initiale sur l'axe Y
        this.isShielded = false;  // Si le joueur a un bouclier actif
        this.damageMultiplier = 1;  // Multiplicateur de dégâts (modifié par certains objets)
        this.specialities = [];
        this.cooldowns = {};  // Cooldowns des objets
        this.width = 20; 
        this.height = 20;
    }

    // Méthode pour appliquer un passif au joueur
    applySpeciality(speciality) {
        speciality.effect(this);
    }

    // Méthode pour vérifier les spécialisations du joueur
    checkSpecialities() {
        this.specialities.forEach(speciality => {
            // Ici, on applique l'effet de chaque spécialité
            this.applySpeciality(speciality);
        });
    }

    // Méthode pour dessiner le joueur (sur le canvas par exemple)
    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, 20, 20);  // Dessine un carré pour représenter le joueur
    }

    // Méthode pour faire avancer le joueur
    move(keys) {
        if (keys['ArrowUp'] || keys['w']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d']) this.x += this.speed;
    }

    // Méthode pour utiliser un objet (en vérifiant le cooldown)
    useItem(item, canvas) {
        const currentTime = Date.now();
        
        // Si l'objet n'a pas de cooldown ou si le cooldown est terminé
        if (this.cooldowns[item.name] && currentTime < this.cooldowns[item.name]) {
            console.log(`${item.name} is still on cooldown!`);
            return;
        }

        // Appliquer l'effet de l'objet
        item.effect(this, canvas);

        // Mettre à jour le cooldown de l'objet
        if (item.cooldown > 0) {
            this.cooldowns[item.name] = currentTime + item.cooldown;
            console.log(`${item.name} is now on cooldown for ${item.cooldown / 1000} seconds.`);
        }
    }
}

// Définir plusieurs types de joueurs avec des caractéristiques uniques
export const players = {
    warrior: new Player("Warrior", 150, 3, 20, 2000), // vitesse réaliste de 3
    scout: new Player("Scout", 100, 4, 15, 1500), // vitesse réaliste de 4
    tank: new Player("Tank", 200, 2, 10, 3000), // vitesse réaliste de 2
    sniper: new Player("Sniper", 80, 3, 30, 2500), // vitesse réaliste de 3
    medic: new Player("Medic", 120, 3, 12, 1800) // vitesse réaliste de 3
};

// Spécialités des joueurs

// Warrior - Guerrier
players.warrior.specialities.push(
    {
        name: "Shield",
        effect: function(player) {
            player.isShielded = true;  // Applique un bouclier au joueur, réduisant les dégâts reçus
        }
    },
    {
        name: "Damage Boost",
        effect: function(player) {
            player.damageMultiplier = 1.5;  // Augmente les dégâts du joueur de 50%
        }
    }
);

// Scout - Éclaireur
players.scout.specialities.push(
    {
        name: "Speed Boost",
        effect: function(player) {
            player.speed += 1;  // Augmente la vitesse du joueur
        }
    },
    {
        name: "Stealth",
        effect: function(player) {
            player.isInvisible = true;  // Rends le joueur temporairement invisible pour les ennemis
        }
    }
);

// Tank - Char
players.tank.specialities.push(
    {
        name: "Damage Reduction",
        effect: function(player) {
            player.damageMultiplier = 0.5;  // Réduit les dégâts reçus de 50%
        }
    },
    {
        name: "Health Regeneration",
        effect: function(player) {
            setInterval(() => {
                if (player.health < player.maxHealth) {
                    player.health += 1;  // Régénère 1 point de vie chaque seconde
                }
            }, 1000);
        }
    }
);

// Sniper - Tireur d'élite
players.sniper.specialities.push(
    {
        name: "Critical Hit",
        effect: function(player) {
            player.damageMultiplier = 2;  // Double les dégâts infligés par le joueur en cas de coup critique
        }
    },
    {
        name: "Long Range",
        effect: function(player) {
            player.range = 500;  // Augmente la portée de tir du joueur
        }
    }
);

// Medic - Médecin
players.medic.specialities.push(
    {
        name: "Healing Aura",
        effect: function(player) {
            setInterval(() => {
                // Restaure 1 point de vie par seconde pour tous les alliés à proximité
                player.health += 1;
            }, 1000);
        }
    },
    {
        name: "Revive",
        effect: function(player) {
            // Réanime un coéquipier décédé (il faudrait ajouter une logique de gestion des alliés)
            console.log("Reviving teammate...");
        }
    }
);

// Fonction pour récupérer un joueur par son type
export function getPlayerByType(type) {
    return players[type] || players.warrior;  // Retourne le joueur de type par défaut "warrior" si type incorrect
}