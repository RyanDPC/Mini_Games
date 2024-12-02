document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments DOM nécessaires
    const friendSearchInput = document.getElementById('friend-search');
    const searchFriendButton = document.getElementById('search-friend-btn');
    const searchResults = document.getElementById('search-results');
    const searchMessage = document.getElementById('search-message');
    const friendsUl = document.getElementById('friends-ul');

    const apiUrl = window.location.origin.includes('localhost')
        ? 'https://localhost:4000/api'
        : 'https://localhost:3000/api';

    console.log("API URL déterminée : ", apiUrl);

    // Récupération de l'utilisateur connecté depuis localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    console.log("Utilisateur connecté : ", user);

    // Fonction pour rechercher des amis
    async function searchFriends() {
        const query = friendSearchInput.value.trim();

        if (!query) {
            searchMessage.textContent = 'Veuillez entrer un nom d\'utilisateur.';
            return;
        }

        searchMessage.textContent = 'Recherche en cours...';

        try {
            console.log("Envoi de la recherche pour l'utilisateur : ", query);
            const response = await fetch(`${apiUrl}/users/search?username=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la recherche.');
            }

            const data = await response.json();
            console.log("Résultats de la recherche : ", data);

            searchResults.innerHTML = ''; // Réinitialiser les résultats précédents
            searchMessage.textContent = `${data.users.length} utilisateur(s) trouvé(s) :`;

            data.users.forEach((user) => {
                const li = document.createElement('li');
                li.textContent = user.username;

                // Ajouter un bouton "Ajouter" pour chaque utilisateur
                const addButton = document.createElement('button');
                addButton.textContent = 'Ajouter';
                addButton.onclick = () => addFriend(user.id);
                li.appendChild(addButton);

                searchResults.appendChild(li);
            });
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
            searchMessage.textContent = 'Une erreur est survenue lors de la recherche.';
        }
    }

    // Fonction pour ajouter un ami
    async function addFriend(friendId) {
        if (!userId) {
            alert('Veuillez vous connecter pour ajouter des amis.');
            return;
        }

        try {
            console.log("Envoi de la demande d'ami pour l'utilisateur ID : ", friendId);
            const response = await fetch(`${apiUrl}/friends/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await response.json();
            console.log("Réponse de l'ajout d'ami : ", data);

            if (response.ok) {
                alert('Ami ajouté avec succès.');
                loadFriendsList(); // Recharger la liste des amis
            } else {
                alert(data.message || 'Erreur lors de l\'ajout.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout d\'ami :', error);
            alert('Une erreur est survenue.');
        }
    }

    // Fonction pour charger la liste des amis
    async function loadFriendsList(page = 1, limit = 10) {
        const userToken = localStorage.getItem('token');
        console.log("Vérification du token de l'utilisateur...");
    
        if (!userToken) {
            console.log("Token utilisateur manquant, redirection vers la page de connexion.");
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return;
        }
    
        try {
            // Vérification de la validité du token via un appel à l'API
            console.log("Vérification de la validité du token...");
            const tokenValidationResponse = await fetch(`${apiUrl}/auth/validate-token`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
    
            if (!tokenValidationResponse.ok) {
                console.error("Token non valide, redirection vers la page de connexion.");
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return;
            }
    
            console.log("Token valide, chargement de la liste des amis...");
            const response = await fetch(`${apiUrl}/friends/list?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des amis.');
            }
    
            const data = await response.json();
            console.log("Liste des amis reçue : ", data);
    
            friendsUl.innerHTML = ''; // Réinitialiser la liste des amis
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
            console.error("Erreur lors du chargement de la liste des amis :", error);
            friendsUl.innerHTML = '<li>Une erreur est survenue lors du chargement des amis.</li>';
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
