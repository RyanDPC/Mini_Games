// Liste des armes disponibles
export const weaponLibrary = {
    pistol: {
        name: "Pistol",
        damage: 10,
        fireRate: 500, // En millisecondes
        reloadTime: 2000, // Temps de rechargement
        bulletSpeed: 6, // Vitesse du projectile
        bulletSize: 5, // Taille du projectile
        bulletColor: 'yellow',
        maxAmmo: 12,
        currentAmmo: 12,
        range: 300, // Portée
        accuracy: 90, // Précision
        isAutomatic: false, // Non automatique
        spread: 0, // Pas de dispersion
        explosionRadius: 0, // Pas d'explosion
        isMelee: false
    },
    shotgun: {
        name: "Shotgun",
        damage: 20,
        fireRate: 800,
        reloadTime: 2500,
        bulletSpeed: 4,
        bulletSize: 10,
        bulletColor: 'yellow',
        maxAmmo: 6,
        currentAmmo: 6,
        range: 200,
        accuracy: 60,
        isAutomatic: false,
        spread: 15, // Diffusion des balles
        explosionRadius: 0,
        isMelee: false
    },
    assaultRifle: {
        name: "Assault Rifle",
        damage: 8,
        fireRate: 150,
        reloadTime: 3000,
        bulletSpeed: 8,
        bulletSize: 4,
        bulletColor: 'yellow',
        maxAmmo: 30,
        currentAmmo: 30,
        range: 500,
        accuracy: 80,
        isAutomatic: true, // Automatique
        spread: 5, // Légère dispersion
        explosionRadius: 0,
        isMelee: false
    },
    sniper: {
        name: "Sniper",
        damage: 50,
        fireRate: 1000,
        reloadTime: 3000,
        bulletSpeed: 12,
        bulletSize: 6,
        bulletColor: 'yellow',
        maxAmmo: 5,
        currentAmmo: 5,
        range: 1000,
        accuracy: 95, // Très précise
        isAutomatic: false,
        spread: 0, // Pas de dispersion
        explosionRadius: 0,
        isMelee: false
    },
    rocketLauncher: {
        name: "Rocket Launcher",
        damage: 100,
        fireRate: 2000,
        reloadTime: 4000,
        bulletSpeed: 3,
        bulletSize: 15,
        bulletColor: 'yellow',
        maxAmmo: 1,
        currentAmmo: 1,
        range: 600,
        accuracy: 70,
        isAutomatic: false,
        spread: 0,
        explosionRadius: 100, // Rayon d'explosion
        isMelee: false
    },
    flamethrower: {
        name: "Flamethrower",
        damage: 5,
        fireRate: 50, // Très rapide
        reloadTime: 0, // Pas de rechargement
        bulletSpeed: 3,
        bulletSize: 8,
        bulletColor: 'red',
        maxAmmo: 100, // Décompte des carburants
        currentAmmo: 100,
        range: 150,
        accuracy: 70,
        isAutomatic: true,
        spread: 30, // Large dispersion
        explosionRadius: 0,
        isMelee: false
    },
    crossbow: {
        name: "Crossbow",
        damage: 40,
        fireRate: 1500, // Tir lent
        reloadTime: 3000, // Temps de recharge
        bulletSpeed: 10,
        bulletSize: 7,
        bulletColor: 'green',
        maxAmmo: 5,
        currentAmmo: 5,
        range: 800,
        accuracy: 90,
        isAutomatic: false,
        spread: 0,
        explosionRadius: 0,
        isMelee: false
    },
    smg: {
        name: "Submachine Gun",
        damage: 5,
        fireRate: 100, // Très rapide
        reloadTime: 1500, // Temps de rechargement court
        bulletSpeed: 6,
        bulletSize: 3,
        bulletColor: 'blue',
        maxAmmo: 50,
        currentAmmo: 50,
        range: 400,
        accuracy: 70,
        isAutomatic: true, // Automatique
        spread: 10, // Légère dispersion
        explosionRadius: 0,
        isMelee: false
    },
    grenade: {
        name: "Grenade",
        damage: 100,
        fireRate: 0, // Pas de tir direct
        reloadTime: 3000,
        bulletSpeed: 0, // Pas de vitesse de balle
        bulletSize: 20, // Taille de l'explosion
        bulletColor: 'orange',
        maxAmmo: 3,
        currentAmmo: 3,
        range: 0, // Pas de portée de tir
        accuracy: 0, // Non applicable
        isAutomatic: false,
        spread: 0,
        explosionRadius: 100, // Rayon de l'explosion
        isMelee: false
    }
};

// Fonction pour récupérer une arme par son nom
export function getWeapon(weaponName) {
    return weaponLibrary[weaponName];
}
