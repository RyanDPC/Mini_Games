// item.js

// Liste des items disponibles
export const itemLibrary = {
    healthPack: {
        name: "Health Pack",
        description: "Restores 20 health points.",
        effect: (player) => {
            player.health = Math.min(player.health + 20, player.maxHealth);
            console.log(`Health restored! Current health: ${player.health}`);
        },
        cooldown: 0,  // Pas de cooldown pour cet item
        duration: 0,  // Pas de durée
    },
    shieldBooster: {
        name: "Shield Booster",
        description: "Grants a temporary shield that absorbs damage for 10 seconds.",
        effect: (player) => {
            player.isShielded = true;
            console.log("Shield activated!");

            setTimeout(() => {
                player.isShielded = false;
                console.log("Shield deactivated!");
            }, 10000);  // Bouclier dure 10 secondes
        },
        cooldown: 20000,  // Cooldown de 20 secondes
        duration: 10000,  // Durée de l'effet
    },
    damageBoost: {
        name: "Damage Boost",
        description: "Increases damage output by 50% for 10 seconds.",
        effect: (player) => {
            player.damageMultiplier = 1.5;
            console.log("Damage boost activated!");

            setTimeout(() => {
                player.damageMultiplier = 1;
                console.log("Damage boost deactivated!");
            }, 10000);  // Dure 10 secondes
        },
        cooldown: 30000,  // Cooldown de 30 secondes
        duration: 10000,  // Durée de l'effet
    },
    speedBoost: {
        name: "Speed Boost",
        description: "Increases movement speed by 2x for 5 seconds.",
        effect: (player) => {
            player.speed *= 2;
            console.log("Speed boost activated!");

            setTimeout(() => {
                player.speed /= 2;
                console.log("Speed boost deactivated!");
            }, 5000);  // Dure 5 secondes
        },
        cooldown: 20000,  // Cooldown de 20 secondes
        duration: 5000,  // Durée de l'effet
    },
    grenade: {
        name: "Grenade",
        description: "Throws a grenade that deals massive area damage.",
        effect: (player) => {
            // Exécution de l'explosion (implémentation à ajouter)
            console.log("Grenade thrown!");
            // Exemple de déclenchement d'une explosion
            triggerExplosion(player.x, player.y, 50, 100, enemies);  
        },
        cooldown: 5000,  // Cooldown de 5 secondes
        duration: 0,  // Pas de durée
    },
    rocketLauncher: {
        name: "Rocket Launcher",
        description: "Launches a rocket that deals explosive damage.",
        effect: (player) => {
            // Exécution du tir de roquette (implémentation à ajouter)
            console.log("Rocket fired!");
            // Exemple de fonction pour tirer une roquette
            fireRocket(player.x, player.y, player.angle);  
        },
        cooldown: 3000,  // Cooldown de 3 secondes
        duration: 0,  // Pas de durée
    },
    ammoPack: {
        name: "Ammo Pack",
        description: "Restores 30 bullets to the player's current weapon.",
        effect: (player) => {
            player.ammo = Math.min(player.ammo + 30, player.weapon.maxAmmo);
            console.log(`Ammo restored! Current ammo: ${player.ammo}`);
        },
        cooldown: 0,  // Pas de cooldown
        duration: 0,  // Pas de durée
    },
    teleportationDevice: {
        name: "Teleportation Device",
        description: "Teleports the player to a random location on the map.",
        effect: (player, canvas) => {
            const newX = Math.random() * canvas.width;
            const newY = Math.random() * canvas.height;
            player.x = newX;
            player.y = newY;
            console.log(`Player teleported to new location: (${newX}, ${newY})`);
        },
        cooldown: 20000,  // Cooldown de 20 secondes
        duration: 0,  // Pas de durée
    },
};

// Fonction pour récupérer un item par son nom
export function getItem(itemName) {
    return itemLibrary[itemName];
}

// Fonction pour vérifier si un item doit être ramassé par le joueur
export function checkItem(player, itemName, canvas) {
    const item = getItem(itemName);  // Récupérer l'item
       
    if (!item) {
        console.log("Item not found!");
        return;
    }
       
    // Vérifier le cooldown
    if (item.cooldown > 0 && player.lastItemUseTime && (Date.now() - player.lastItemUseTime < item.cooldown)) {
        console.log(`${item.name} is on cooldown. Try again later.`);
        return;
    }

    // Appliquer l'effet de l'item
    item.effect(player, canvas);

    // Enregistrer l'heure d'utilisation de l'item pour gérer le cooldown
    player.lastItemUseTime = Date.now();
}
