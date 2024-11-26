document.addEventListener('DOMContentLoaded', () => {
    // Variables DOM pour la liste des jeux
    const gameList = document.getElementById("game-list");
    const searchInput = document.getElementById("search-input");

    // Récupérer la liste des jeux
    fetchGames();

    // Gestion de la recherche de jeux
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        fetch("/api/games")
            .then((response) => response.json())
            .then((games) => {
                const filteredGames = games.filter((game) =>
                    game.name.toLowerCase().includes(searchValue)
                );
                displayGames(filteredGames);
            });
    });

    // Affichage des jeux
    function displayGames(games) {
        gameList.innerHTML = ""; // Vider la liste actuelle
        if (games.length === 0) {
            gameList.innerHTML = "<p>Aucun jeu trouvé</p>";
            return;
        }
        games.forEach((game) => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <h3>${game.name}</h3>
                <div class="triangle-launch" onclick="toggleGameState(this, '${game.path}')"></div>
            `;
            gameList.appendChild(gameCard);
        });
    }

    // Stocker l'état des jeux lancés
    const launchedGames = new Set();

    // Fonction pour lancer ou mettre en pause un jeu
    window.toggleGameState = function (button, gameName) {
        if (launchedGames.has(gameName)) {
            alert(`Le jeu "${gameName}" est déjà lancé.`);
        } else {
            launchedGames.add(gameName);
            const gameWindow = window.open(
                gameName,
                "_blank",
                "noopener,noreferrer"
            );

            if (gameWindow) {
                const checkInterval = setInterval(() => {
                    if (gameWindow.closed) {
                        launchedGames.delete(gameName);
                        clearInterval(checkInterval);
                    }
                }, 1000);
            }
        }
    };

    // Fonction pour charger la liste des jeux
    function fetchGames() {
        fetch("/api/games")
            .then((response) => {
                console.log("Statut de la réponse :", response.status);
                if (!response.ok) {
                    throw new Error(`Erreur API : ${response.status}`);
                }
                return response.json();
            })
            .then((games) => {
                console.log("Jeux récupérés depuis l'API :", games);
                displayGames(games);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des jeux :", error);
            });
    }
});
