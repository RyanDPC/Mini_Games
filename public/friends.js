document.addEventListener('DOMContentLoaded', () => {
    const friendsList = document.getElementById('friends-list');
    const friendsUl = document.getElementById('friends-ul');
    const sendFriendRequestButton = document.getElementById('send-friend-request-btn');
    const searchFriendButton = document.getElementById('search-friend-btn');
    const friendSearchInput = document.getElementById('friend-search');
    const searchMessage = document.getElementById('search-message');
    
    // Détection de l'URL du serveur API selon l'origine du client
    const apiUrl = window.location.origin.includes('localhost') ? 'http://localhost:4000/api/users' : 'http://localhost:3000/api/users'; // Dynamique pour les environnements locaux et de production
 
    async function loadFriendsList() {
        try {
            const response = await fetch(`${apiUrl}/friends/${userId}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            if (data.friends && data.friends.length > 0) {
                friendsUl.innerHTML = ''; // Vider la liste avant de la remplir
                data.friends.forEach(friend => {
                    const li = document.createElement('li');
                    li.textContent = friend.username;
                    friendsUl.appendChild(li);
                });
            } else {
                friendsUl.innerHTML = '<li>Aucun ami ajouté.</li>';
            }
        } catch (error) {
            console.error('Erreur lors du chargement des amis:', error);
            friendsUl.innerHTML = `<li>Erreur lors du chargement des amis: ${error.message}</li>`;
        }
    }
    const savedUser = localStorage.getItem('user');
    let userId = null;

    // Si l'utilisateur est connecté
    if (savedUser) {
        const user = JSON.parse(savedUser);
        userId = user.id;
        loadFriendsList();
    }
    async function sendFriendRequest(username) {
        try {
            const response = await fetch(`${apiUrl}/send-friend-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendUsername: username })
            });
            const data = await response.json();
            if (data.message) {
                alert(data.message);
                loadFriendsList(); // Recharger la liste des amis après l'envoi
            } else {
                alert('Erreur lors de l\'envoi de la demande d\'ami.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
            alert('Une erreur est survenue lors de l\'envoi de la demande.');
        }
    }

    searchFriendButton.addEventListener('click', async () => {
        const usernameToSearch = friendSearchInput.value.trim();
        if (usernameToSearch) {
            searchMessage.textContent = 'Recherche en cours...'; // Ajout d'un message de recherche
            try {
                const response = await fetch(`${apiUrl}/search-users?username=${usernameToSearch}`);
                
                if (!response.ok) {
                    throw new Error('Utilisateur non trouvé.');
                }
    
                const data = await response.json();
                if (data.users && data.users.length > 0) {
                    searchMessage.textContent = `${data.users.length} utilisateur(s) trouvé(s) :`;
                    sendFriendRequestButton.style.display = 'inline-block';
                    const searchResults = document.getElementById('search-results');
                    searchResults.innerHTML = ''; 
    
                    data.users.forEach(user => {
                        const userItem = document.createElement('li');
                        userItem.textContent = user.username;
                        const requestButton = document.createElement('button');
                        requestButton.textContent = 'Envoyer une demande d\'ami';
                        requestButton.onclick = () => sendFriendRequest(user.username);
                        userItem.appendChild(requestButton);
                        searchResults.appendChild(userItem);
                    });
                } else {
                    searchMessage.textContent = 'Aucun utilisateur trouvé avec ce nom.';
                    sendFriendRequestButton.style.display = 'none';
                }
            } catch (error) {
                console.error('Erreur lors de la recherche d\'utilisateurs:', error);
                searchMessage.textContent = `Erreur: ${error.message}`;
                sendFriendRequestButton.style.display = 'none';
            }
        } else {
            searchMessage.textContent = 'Veuillez entrer un nom d\'utilisateur.';
        }
    });
    

    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.reload();
    });

    const searchResults = document.createElement('ul');
    searchResults.id = 'search-results';
    friendsList.appendChild(searchResults);
});
