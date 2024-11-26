document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de Socket.io si disponible
    if (typeof io !== 'undefined') {
        const socket = io(); // Connexion au serveur via socket.io

        // Écouter l'événement "refresh" du serveur
        socket.on('refresh', () => {
            console.log('Rafraîchissement déclenché par le serveur');
            window.location.reload();
        });
    }

    // Variables pour les popups
    const loginBtn = document.getElementById('login-btn');
    const popupContainer = document.getElementById('popup-container');
    const overlay = document.getElementById('overlay');

    // Écouteur pour afficher la popup de login
    loginBtn?.addEventListener('click', () => {
        loadPopupContent('login.html');
    });

    // Fermeture via l'overlay
    overlay.addEventListener('click', closePopup);

    // Fonction pour charger dynamiquement un fichier HTML
    const loadPopupContent = async (file) => {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            popupContainer.innerHTML = content;
            popupContainer.style.display = 'block';
            overlay.style.display = 'block';
    
            // Ajouter la gestion de fermeture dans le popup chargé
            document.getElementById('close-popup').addEventListener('click', closePopup);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier HTML:', error);
        }
    };
    
    // Fonction pour fermer la popup
    function closePopup() {
        popupContainer.style.display = 'none';
        overlay.style.display = 'none';
    }
});
