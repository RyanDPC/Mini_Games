// weapon.js

// Liste des armes disponibles
export const weaponLibrary = {
    pistol: {
        name: "Pistol",
        damage: 10,
        fireRate: 500, // En millisecondes (temps entre les tirs)
        reloadTime: 2000, // Temps de rechargement en millisecondes
        bulletSpeed: 6, // Vitesse du projectile
        bulletSize: 5, // Taille du projectile
        bulletColor: 'yellow',
        maxAmmo: 12 // Nombre maximum de balles dans un chargeur
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
        spread: 15 // Différentes directions pour les balles
    },
    assaultRifle: {
        name: "Assault Rifle",
        damage: 8,
        fireRate: 150,
        reloadTime: 3000,
        bulletSpeed: 8,
        bulletSize: 4,
        bulletColor: 'yellow',
        maxAmmo: 30
    },
    sniper: {
        name: "Sniper",
        damage: 50,
        fireRate: 1000,
        reloadTime: 3000,
        bulletSpeed: 12,
        bulletSize: 6,
        bulletColor: 'yellow',
        maxAmmo: 5
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
        explosionRadius: 100 // Rayon de l'explosion
    }
};

// Fonction pour récupérer une arme par son nom
export function getWeapon(weaponName) {
    return weaponLibrary[weaponName];
}
