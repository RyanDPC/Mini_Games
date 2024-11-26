document.addEventListener('DOMContentLoaded', () => {
    // Variables DOM pour la liste des jeux et la barre de recherche
    const gameList = document.getElementById("game-list");
    const searchInput = document.getElementById("search-input");

    // Charger la liste des jeux
    fetchGames();

    // Ajouter un gestionnaire d'événements à l'input de recherche
    searchInput.addEventListener("input", handleSearch);

    // Gérer la recherche de jeux
    function handleSearch() {
        const searchValue = searchInput.value.trim().toLowerCase();
        fetch("/api/games")
            .then((response) => response.json())
            .then((games) => {
                // Filtrer les jeux en fonction de la valeur de la recherche
                const filteredGames = games.filter((game) =>
                    game.name.toLowerCase().includes(searchValue)
                );
                displayGames(filteredGames);
            })
            .catch((error) => {
                console.error("Erreur lors de la recherche de jeux :", error);
            });
    }

    // Afficher les jeux sur la page
    function displayGames(games) {
        // Réinitialiser la liste des jeux
        gameList.innerHTML = "";

        if (games.length === 0) {
            gameList.innerHTML = "<p>Aucun jeu trouvé</p>";
            return;
        }

        // Créer et ajouter chaque carte de jeu à la liste
        games.forEach((game) => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");

            gameCard.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.name}">
                <h3>${game.name}</h3>
                <div class="triangle-launch"></div>
            `;

            // Ajouter un gestionnaire d'événement à chaque bouton de lancement de jeu
            gameCard.querySelector(".triangle-launch").addEventListener("click", () => {
                toggleGameState(game.indexUrl);
            });

            gameList.appendChild(gameCard);
        });
    }

    // Stocker l'état des jeux lancés pour éviter les doublons
    const launchedGames = new Set();

    // Fonction pour lancer ou vérifier l'état du jeu
    function toggleGameState(gameUrl) {
        if (launchedGames.has(gameUrl)) {
            alert(`Le jeu "${gameUrl}" est déjà lancé.`);
        } else {
            launchedGames.add(gameUrl);
            const gameWindow = window.open(gameUrl, "_blank", "noopener,noreferrer");

            if (gameWindow) {
                // Vérifier périodiquement si la fenêtre de jeu est fermée pour mettre à jour l'état
                const checkInterval = setInterval(() => {
                    if (gameWindow.closed) {
                        launchedGames.delete(gameUrl);
                        clearInterval(checkInterval);
                    }
                }, 1000);
            }
        }
    }

    // Fonction pour charger la liste des jeux depuis l'API
    function fetchGames() {
        fetch("/api/games")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erreur API : ${response.status}`);
                }
                return response.json();
            })
            .then((games) => {
                displayGames(games);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des jeux :", error);
                gameList.innerHTML = "<p>Erreur lors du chargement des jeux. Veuillez réessayer plus tard.</p>";
            });
    }
});
