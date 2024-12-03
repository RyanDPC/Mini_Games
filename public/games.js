document.addEventListener('DOMContentLoaded', () => {
    // Variables DOM for the game list and search input
    const gameList = document.getElementById("game-list");
    const searchInput = document.getElementById("search");
    // Fetch the games list
    fetchGames();

    // Add event listener to the search input
    searchInput.addEventListener("input", handleSearch);

    // Handle game search
    function handleSearch() {
        const searchValue = searchInput.value.trim().toLowerCase();
        fetch("/api/games")
            .then((response) => response.json())
            .then((games) => {
                if (!Array.isArray(games)) {
                    console.error("La réponse du serveur n'est pas un tableau:", games);
                    return;
                }

                // Filter games based on search value
                const filteredGames = games.filter((game) =>
                    game.name.toLowerCase().includes(searchValue)
                );
                displayGames(filteredGames);
            })
            .catch((error) => {
                console.error("Erreur lors de la recherche des jeux:", error);
            });
    }

    // Display games in the DOM
    function displayGames(games) {
        // Reset game list
        gameList.innerHTML = "";

        if (games.length === 0) {
            gameList.innerHTML = "<p>Aucun jeu trouvé.</p>";
            return;
        }

        // Loop through games and display each one
        games.forEach((game) => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');

            // Game Image
            const gameImage = document.createElement('img');
            gameImage.src = `/views/games/${game.name}/img.png`;  // Chemin mis à jour vers l'image
            gameImage.alt = game.name;

            // Game Title
            const gameTitle = document.createElement('h3');
            gameTitle.textContent = game.name;

            // Append the image and title to the card
            gameCard.appendChild(gameImage);
            gameCard.appendChild(gameTitle);

            // Add event listener for redirect
            gameCard.addEventListener('click', () => {
                // Redirect to the game's specific page
                window.location.href = `/games/${game.name}`;
            });

            // Append the card to the game list
            gameList.appendChild(gameCard);
        });
    }

    // Fetch the list of games from the server
    function fetchGames() {
        fetch("/api/games")
            .then((response) => response.json())
            .then((games) => {
                console.log("Données des jeux récupérées:", games);
                if (!Array.isArray(games)) {
                    console.error("Le serveur a retourné un objet au lieu d'un tableau. Voici la réponse :", games);
                    return;
                }
                displayGames(games);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des jeux:", error);
            });
    }
});
