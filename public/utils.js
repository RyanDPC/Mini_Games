// Fichier: public/js/utils.js

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('visible');

    // Cacher la notification après un certain temps
    setTimeout(() => {
        notification.classList.remove('visible');
        notification.classList.add('hidden');
    }, duration);
}
