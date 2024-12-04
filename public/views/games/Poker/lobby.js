document.addEventListener('DOMContentLoaded', () => {
    console.log("Lobby script loaded.");

    // Récupérer les informations de l'utilisateur depuis les attributs de la balise <body>
    const userId = document.body.dataset.userId;
    const username = document.body.dataset.username;

    if (!username) {
        console.error("Utilisateur non authentifié. Impossible de rejoindre le lobby.");
        return;
    }

    const socket = io(); // Connecter à Socket.io pour la salle d'attente

    // Rejoindre la salle d'attente lorsque la page est chargée
    socket.emit('joinLobby', { userId, username });

    // Ecouter quand un autre joueur rejoint la salle d'attente
    socket.on('playerJoined', (player) => {
        console.log(`${player.username} a rejoint la salle d'attente.`);
        const lobbyMessage = document.createElement('p');
        lobbyMessage.textContent = `${player.username} a rejoint la salle d'attente.`;
        document.querySelector('.lobby-container').appendChild(lobbyMessage);
    });

    // Logique pour lancer le jeu une fois qu'il y a suffisamment de joueurs
    socket.on('startGame', () => {
        console.log("Nombre de joueurs suffisant. Lancement du jeu.");
        window.location.href = "/games/Poker/main";
    });
});
