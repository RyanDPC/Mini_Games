document.addEventListener('DOMContentLoaded', () => {
    const friendSearchInput = document.getElementById('friend-search');
    const searchFriendButton = document.getElementById('search-friend-btn');
    const searchResults = document.getElementById('search-results');
    const searchMessage = document.getElementById('search-message');
    const friendsUl = document.getElementById('friends-ul');

    const apiUrl = window.location.origin.includes('localhost')
        ? 'https://localhost:4000/api'
        : 'https://localhost:3000/api';

    let refreshAttempted = false; // Pour éviter les boucles infinies

    const user = JSON.parse(localStorage.getItem('user'));

    // Fonction pour gérer les réponses du serveur
    async function handleServerResponse(response, retryCallback) {
        if (!response.ok) {
            if (response.status === 401 && !refreshAttempted) {
                console.warn('Token expiré. Tentative de rafraîchissement...');
                refreshAttempted = true;
                const newAccessToken = await refreshAccessToken(user.refreshToken);

                if (newAccessToken) {
                    return retryCallback(); // Réexécute la requête initiale
                }
            }

            const errorData = await response.json();
            throw new Error(errorData.message || 'Une erreur est survenue.');
        }

        refreshAttempted = false; // Réinitialise après un succès
        return response.json();
    }

    // Fonction pour rafraîchir le token d'accès
    async function refreshAccessToken(refreshToken) {
        try {
            const response = await fetch(`${apiUrl}/users/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) throw new Error('Échec du rafraîchissement du token.');

            const data = await response.json();
            const updatedUser = { ...user, token: data.accessToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Token d\'accès rafraîchi avec succès.');

            return data.accessToken;
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token :', error);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }

    // Fonction pour rechercher des amis
    async function searchFriends() {
        const query = friendSearchInput.value.trim();
        if (!query) {
            searchMessage.textContent = 'Veuillez entrer un nom d\'utilisateur.';
            return;
        }

        searchMessage.textContent = 'Recherche en cours...';
        try {
            const response = await fetch(`${apiUrl}/users/search?username=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${user.token}` },
            });

            const data = await handleServerResponse(response, searchFriends);

            searchResults.innerHTML = ''; // Réinitialise les résultats précédents
            searchMessage.textContent = `${data.users.length} utilisateur(s) trouvé(s) :`;

            data.users.forEach((user) => {
                const li = document.createElement('li');
                li.textContent = user.username;

                const addButton = document.createElement('button');
                addButton.textContent = 'Ajouter';
                addButton.onclick = () => addFriend(user.id);
                li.appendChild(addButton);

                searchResults.appendChild(li);
            });
        } catch (error) {
            console.error('Erreur:', error);
            searchMessage.textContent = error.message || 'Une erreur est survenue lors de la recherche.';
        }
    }

    // Fonction pour ajouter un ami
    async function addFriend(friendId) {
        try {
            const response = await fetch(`${apiUrl}/friends/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ friendId }),
            });

            const data = await handleServerResponse(response, () => addFriend(friendId));
            searchMessage.textContent = 'Ami ajouté avec succès.';
            loadFriendsList();
        } catch (error) {
            console.error('Erreur:', error);
            searchMessage.textContent = error.message || 'Une erreur est survenue.';
        }
    }

    // Fonction pour charger la liste des amis
    async function loadFriendsList() {
        try {
            const response = await fetch(`${apiUrl}/friends/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const data = await handleServerResponse(response, loadFriendsList);

            friendsUl.innerHTML = '';
            if (data.friends.length === 0) {
                friendsUl.innerHTML = '<li>Aucun ami pour le moment.</li>';
            } else {
                data.friends.forEach((friend) => {
                    const li = document.createElement('li');
                    li.textContent = friend.username;
                    friendsUl.appendChild(li);
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            friendsUl.innerHTML = '<li>Une erreur est survenue lors du chargement.</li>';
        }
    }

    // Écouteur pour le bouton de recherche
    if (searchFriendButton) {
        searchFriendButton.addEventListener('click', searchFriends);
    } else {
        console.error('Le bouton "search-friend-btn" est introuvable.');
    }

    // Charge la liste des amis
    if (friendsUl) {
        loadFriendsList();
    }
});
