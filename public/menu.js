document.addEventListener('DOMContentLoaded', () => {
    if (typeof io !== 'undefined') {
    const socket = io(); // Connexion au serveur via socket.io
    // Écouter l'événement "refresh" du serveur
    socket.on('refresh', () => {
        console.log('Rafraîchissement déclenché par le serveur');
        window.location.reload();
    });
}

    
    // Empêche la saisie ailleurs que dans la barre de recherche
    document.addEventListener('mousedown', (event) => {
        if (!searchInput) return;
        if (event.target !== searchInput && event.target.tagName !== 'INPUT' && !event.target.closest('.search-bar')) {
            event.preventDefault();
        }
    });

    const gameList = document.getElementById('game-list');
    const searchInput = document.getElementById('search-input');

    // Récupérer les jeux via l'API
    fetch('/api/games')
        .then(response => response.json())
        .then(games => {
            console.log('Jeux récupérés depuis l\'API:', games);
            displayGames(games);
        });

    // Gestion de la recherche
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        fetch('/api/games')
            .then(response => response.json())
            .then(games => {
                const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchValue));
                displayGames(filteredGames);
            });
    });

    function displayGames(games) {
        gameList.innerHTML = ''; // Vider la liste actuelle des jeux
        if (games.length === 0) {
            gameList.innerHTML = '<p>Aucun jeu trouvé</p>';
            return;
        }
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.style.marginBottom = '1px'; // Réduire l'espacement entre les jeux
            gameCard.style.marginRight = '1px'; // Réduire l'espacement entre les jeux
            gameCard.innerHTML = `
                <img src="/games/${game.name}/${game.name}.png" alt="${game.name}">
                <h3>${game.name}</h3>
                <div class="triangle-launch" onclick="toggleGameState(this, '${game.name}')"></div>
            `;
            gameList.appendChild(gameCard);
            console.log('Affichage du jeu:', game);
        });
    }

    // Stocker l'état des jeux lancés
    const launchedGames = new Set();

    // Fonction pour lancer ou mettre en pause le jeu
    window.toggleGameState = function(button, gameName) {
        if (launchedGames.has(gameName)) {
            button.classList.add('pause');
            button.style.borderTopColor = '#dc3545'; // Double barre rouge
            button.style.borderTopWidth = '1px';
            button.style.borderBottomWidth = '1px';
            button.style.borderLeft = '3px solid #dc3545';
            // Afficher un message que le jeu est déjà lancé
            alert(`Le jeu "${gameName}" est déjà en cours de lancement.`);
        } else {
            button.classList.add('pause');
            button.style.borderLeftColor = '#dc3545'; // Couleur rouge quand en pause
            // Ajouter le jeu aux jeux lancés
            launchedGames.add(gameName);
            // Lancer le jeu dans une nouvelle fenêtre
            const gameWindow = window.open(`/games/${gameName}/index.html`, '_blank', 'noopener,noreferrer');
            // Vérifier régulièrement si le jeu est fermé et rafraîchir l'interface
            if (gameWindow) {
                if (gameWindow) {
        const checkInterval = setInterval(() => {
            if (gameWindow.closed) {
                    launchedGames.delete(gameName);
                    button.classList.remove('pause');
                    button.style.borderTopColor = '#ffcc00'; // Remettre la couleur d'origine
                    button.style.borderTopWidth = '';
                    button.style.borderBottomWidth = '';
                    button.style.borderLeft = '3px solid #ffcc00';
                    clearInterval(checkInterval);
                    } else {
                        // Vérification de la fenêtre toujours ouverte
                    // Rafraîchir la liste des jeux
                    fetch('/api/games')
                        .then(response => response.json())
                        .then(games => {
                            displayGames(games);
                        });
                }
            }, 1000);
        }
    };
}}});
