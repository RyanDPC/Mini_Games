// speciality.js

// Liste des spécialités disponibles
export const specialityLibrary = {
    explosion: {
        name: "Explosion",
        cooldown: 5000, // Temps entre chaque utilisation (en millisecondes)
        radius: 100, // Rayon de l'explosion
        damage: 50, // Dégâts infligés aux ennemis dans le rayon
        duration: 1000 // Durée d'effet (en millisecondes)
    },
    laserBeam: {
        name: "Laser Beam",
        cooldown: 7000,
        damage: 20, // Dégâts infligés par seconde
        width: 5, // Largeur du rayon laser
        range: 300, // Longueur maximale du rayon
        duration: 2000 // Durée d'effet (en millisecondes)
    },
    shield: {
        name: "Shield",
        cooldown: 10000,
        duration: 5000, // Temps de protection (en millisecondes)
        reduction: 50 // Pourcentage de réduction des dégâts subis
    },
    dash: {
        name: "Dash",
        cooldown: 3000,
        speedMultiplier: 3, // Multiplicateur de vitesse pendant le dash
        duration: 500 // Durée du dash (en millisecondes)
    }
};

// Fonction pour récupérer une spécialité par son nom
export function getSpeciality(specialityName) {
    return specialityLibrary[specialityName];
}
