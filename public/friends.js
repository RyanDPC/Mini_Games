document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments DOM nécessaires
    const friendSearchInput = document.getElementById('friend-search');
    const searchFriendButton = document.getElementById('search-friend-btn');
    const searchResults = document.getElementById('search-results');
    const searchMessage = document.getElementById('search-message');
    const friendsUl = document.getElementById('friends-ul');
    const friendStatusFilter = document.getElementById('friend-status-filter');

    const apiUrl = window.location.origin.includes('localhost')
        ? 'https://localhost:4000/api'
        : 'https://localhost:3000/api';

    console.log("API URL déterminée : ", apiUrl);

    // Récupération de l'utilisateur connecté depuis localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    console.log("Utilisateur connecté : ", user);

    // Fonction pour rafraîchir le token d'accès
    async function refreshAccessToken() {
        try {
            const response = await fetch(`${apiUrl}/token/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Token rafraîchi avec succès.");
                localStorage.setItem('accessToken', data.accessToken);
                return data.accessToken;
            } else {
                console.error("Erreur lors du rafraîchissement du token.");
                return null;
            }
        } catch (error) {
            console.error("Erreur lors du rafraîchissement du token : ", error);
            return null;
        }
    }

    // Fonction pour gérer les requêtes avec rafraîchissement de token
    async function authenticatedFetch(url, options = {}) {
        let accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.log("Token d'accès manquant, tentative de rafraîchissement...");
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                console.log("Redirection vers la page de connexion.");
                window.location.href = '/login';
                return;
            }
        }

        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
        };

        const response = await fetch(url, options);

        if (response.status === 401) {
            console.log("Token d'accès expiré, tentative de rafraîchissement...");
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                console.log("Redirection vers la page de connexion.");
                window.location.href = '/login';
                return;
            }
            localStorage.setItem('accessToken', accessToken);

            options.headers['Authorization'] = `Bearer ${accessToken}`;
            return fetch(url, options);
        }

        return response;
    }

     // Fonction pour rechercher des amis
     async function searchFriends() {
        if (!friendSearchInput) {
            console.error("Élément de recherche d'amis introuvable.");
            return;
        }

        const query = friendSearchInput.value.trim();

        if (!query) {
            if (searchMessage) {
                searchMessage.textContent = 'Veuillez entrer un nom d\'utilisateur.';
            }
            return;
        }

        if (searchMessage) {
            searchMessage.textContent = 'Recherche en cours...';
        }

        try {
            console.log("Envoi de la recherche pour l'utilisateur : ", query);
            const response = await authenticatedFetch(`${apiUrl}/users/search?username=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche.');
            }

            const data = await response.json();
            console.log("Résultats de la recherche : ", data);

            if (searchResults) {
                searchResults.innerHTML = ''; // Réinitialiser les résultats précédents
            }

            if (searchMessage) {
                searchMessage.textContent = `${data.users.length} utilisateur(s) trouvé(s) :`;
            }

            // Vérifier si des utilisateurs ont été trouvés
            if (data.users.length === 0) {
                if (searchResults) {
                    searchResults.innerHTML = '<li>Aucun utilisateur trouvé.</li>';
                }
            } else {
                data.users.forEach((user) => {
                    const li = document.createElement('li');
                    li.classList.add('search-result-item');
                    li.textContent = user.username;

                    // Ajouter un bouton "Ajouter" pour chaque utilisateur
                    const addButton = document.createElement('button');
                    addButton.textContent = 'Ajouter';
                    addButton.classList.add('add-friend-btn');
                    addButton.onclick = () => sendFriendRequest(user.id);

                    li.appendChild(addButton);

                    if (searchResults) {
                        searchResults.appendChild(li);
                    }
                });
            }
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            if (searchMessage) {
                searchMessage.textContent = 'Une erreur est survenue lors de la recherche.';
            }
        }
    }
    // Fonction pour envoyer une demande d'ami
    async function sendFriendRequest(friendId) {
        if (!userId) {
            alert('Veuillez vous connecter pour envoyer une demande d\'ami.');
            return;
        }

        try {
            console.log("Envoi de la demande d'ami pour l'utilisateur ID : ", friendId);
            const response = await authenticatedFetch(`${apiUrl}/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId }),
            });

            const data = await response.json();
            console.log("Réponse de la demande d'ami : ", data);

            if (response.ok) {
                alert('Demande d\'ami envoyée avec succès.');
                loadFriendsList(); // Recharger la liste des amis
            } else {
                alert(data.message || 'Erreur lors de l\'envoi de la demande d\'ami.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande d\'ami :', error);
            alert('Une erreur est survenue.');
        }
    }

    // Fonction pour charger la liste des amis
    async function loadFriendsList(page = 1, limit = 10) {
        console.log("Chargement de la liste des amis...");

        try {
            const response = await authenticatedFetch(`${apiUrl}/friends/list?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des amis.');
            }

            const data = await response.json();
            console.log("Liste des amis reçue : ", data);

            if (friendsUl) {
                friendsUl.innerHTML = ''; // Réinitialiser la liste des amis
            }

            if (data.friends.length === 0 && friendsUl) {
                friendsUl.innerHTML = '<li>Aucun ami pour le moment.</li>';
            } else {
                data.friends.forEach((friend) => {
                    const li = document.createElement('li');
                    li.classList.add('friend-item');
                    li.textContent = friend.username;

                    // Ajouter un bouton "Supprimer" pour chaque ami
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Supprimer';
                    removeButton.classList.add('remove-friend-btn');
                    removeButton.onclick = () => removeFriend(friend.id);

                    li.appendChild(removeButton);

                    if (friendsUl) {
                        friendsUl.appendChild(li);
                    }
                });
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la liste des amis :", error);
            if (friendsUl) {
                friendsUl.innerHTML = '<li>Une erreur est survenue lors du chargement des amis.</li>';
            }
        }
    }

    // Fonction pour supprimer un ami
    async function removeFriend(friendId) {
        if (!userId) {
            alert('Veuillez vous connecter pour supprimer un ami.');
            return;
        }

        try {
            console.log("Suppression de l'ami ID : ", friendId);
            const response = await authenticatedFetch(`${apiUrl}/friends/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId }),
            });

            const data = await response.json();
            console.log("Réponse de la suppression de l'ami : ", data);

            if (response.ok) {
                alert('Ami supprimé avec succès.');
                loadFriendsList(); // Recharger la liste des amis
            } else {
                alert(data.message || 'Erreur lors de la suppression de l\'ami.');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'ami :', error);
            alert('Une erreur est survenue.');
        }
    }

    // Ajout d'un écouteur d'événement sur le bouton de recherche
    if (searchFriendButton) {
        console.log("Ajout de l'écouteur sur le bouton de recherche d'ami.");
        searchFriendButton.addEventListener('click', searchFriends);
    } else {
        console.error('Le bouton "search-friend-btn" est introuvable.');
    }

    // Charger la liste des amis au démarrage
    if (friendsUl) {
        console.log("Chargement initial de la liste des amis...");
        loadFriendsList();
    }
});
