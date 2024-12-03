// speciality.js

// Liste des passifs disponibles
export const specialityLibrary = {
    healthBoost: {
        name: "Health Boost",
        description: "Increase max health by 20.",
        effect: (player) => {
            player.maxHealth += 20;
            player.health = player.maxHealth;  // Récupère toute la vie à l'activation du passif
            console.log(`Health increased! Max health is now: ${player.maxHealth}`);
        },
        requiredWave: 3,  // Débloqué à la vague 3
    },
    speedBoost: {
        name: "Speed Boost",
        description: "Increase movement speed by 1.5x.",
        effect: (player) => {
            player.speed *= 1.5;
            console.log(`Speed increased! New speed: ${player.speed}`);
        },
        requiredWave: 5,  // Débloqué à la vague 5
    },
    damageBoost: {
        name: "Damage Boost",
        description: "Increase damage output by 25%.",
        effect: (player) => {
            player.damageMultiplier = 1.25;
            console.log(`Damage increased! New damage multiplier: ${player.damageMultiplier}`);
        },
        requiredWave: 7,  // Débloqué à la vague 7
    },
    reloadBoost: {
        name: "Reload Speed Boost",
        description: "Reduce reload time by 30%.",
        effect: (player) => {
            player.reloadTime *= 0.7;
            console.log(`Reload speed increased! New reload time: ${player.reloadTime}`);
        },
        requiredWave: 10,  // Débloqué à la vague 10
    },
    shieldBoost: {
        name: "Shield Boost",
        description: "Reduce shield cooldown by 50%.",
        effect: (player) => {
            player.shieldCooldown *= 0.5;
            console.log(`Shield cooldown reduced! New cooldown: ${player.shieldCooldown}`);
        },
        requiredWave: 12,  // Débloqué à la vague 12
    },
};

// Fonction pour activer les passifs en fonction de la vague actuelle
export function checkSpecialityUnlock(currentWave, player) {
    // Vérifie les passifs débloqués selon la vague actuelle
    Object.values(specialityLibrary).forEach(speciality => {
        if (currentWave >= speciality.requiredWave && !player.specialities.includes(speciality.name)) {
            speciality.effect(player);  // Applique l'effet du passif
            player.specialities.push(speciality.name);  // Ajoute le passif à la liste des passifs du joueur
            console.log(`${speciality.name} unlocked at wave ${currentWave}`);
        }
    });
}

// Fonction pour réinitialiser les passifs lors du redémarrage du jeu
export function resetSpecialities(player) {
    player.specialities = [];  // Vide la liste des passifs du joueur
    player.maxHealth = 100;  // Réinitialise la santé maximale
    player.health = player.maxHealth;  // Réinitialise la santé du joueur
    player.speed = 5;  // Réinitialise la vitesse
    player.damageMultiplier = 1;  // Réinitialise le multiplicateur de dégâts
    player.reloadTime = 2000;  // Réinitialise le temps de rechargement
    player.shieldCooldown = 5000;  // Réinitialise le cooldown du bouclier
    console.log("Specialities and player stats have been reset!");
}
