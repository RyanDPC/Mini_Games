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
                // Filter games based on search value
                const filteredGames = games.filter((game) =>
                    game.name.toLowerCase().includes(searchValue)
                );
                displayGames(filteredGames);
            })
            .catch((error) => {
                console.error("Error searching for games:", error);
            });
    }

    // Display games in the DOM
    function displayGames(games) {
        // Reset game list
        gameList.innerHTML = "";

        if (games.length === 0) {
            gameList.innerHTML = "<p>No games found.</p>";
            return;
        }

        // Loop through games and display each one
        games.forEach((game) => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');

            // Game Image
            const gameImage = document.createElement('img');
            gameImage.src = `/games/${game.name}/img.png`;  // Path to the game's image
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
                window.location.href = `/games/${game.name}/index.html`;
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
                displayGames(games);
            })
            .catch((error) => {
                console.error("Error fetching games:", error);
            });
    }
});
