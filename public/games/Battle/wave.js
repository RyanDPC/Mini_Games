// wave.js

import { getSpeciality } from './speciality.js';

// Liste des vagues et des spécialités associées
export const waveSpecialities = [
    { wave: 3, speciality: "explosion" }, // Déclencher une explosion à la vague 3
    { wave: 5, speciality: "laserBeam" }, // Déclencher un rayon laser à la vague 5
    { wave: 7, speciality: "shield" }, // Activer un bouclier à la vague 7
    { wave: 10, speciality: "dash" } // Activer un dash à la vague 10
];

// Fonction pour vérifier si une spécialité doit être déclenchée
export function checkWaveSpecialities(currentWave, player, enemies) {
    const specialityData = waveSpecialities.find(w => w.wave === currentWave);

    if (specialityData) {
        const speciality = getSpeciality(specialityData.speciality);
        console.log(`Speciality ${speciality.name} triggered on wave ${currentWave}!`);

        // Appliquer la spécialité
        if (speciality.name === "Explosion") {
            triggerExplosion(player.x, player.y, speciality.radius, speciality.damage, enemies);
        } else if (speciality.name === "Laser Beam") {
            triggerLaserBeam(player.x, player.y, player.angle, speciality.range, speciality.damage, speciality.width, enemies);
        } else if (speciality.name === "Shield") {
            activateShield(player, speciality.duration, speciality.reduction);
        } else if (speciality.name === "Dash") {
            activateDash(player, speciality.speedMultiplier, speciality.duration);
        }
    }
}
