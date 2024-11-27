document.addEventListener('DOMContentLoaded', () => {
    const userSection = document.getElementById('user-section'); // Section en haut à droite
    const popupContainer = document.getElementById('popup-container');
    const overlay = document.getElementById('overlay');

    // Vérifiez si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserDetails(token);
    } else {
        displayLoginButton();
    }

    // Fonction pour afficher le bouton "Login"
    function displayLoginButton() {
        userSection.innerHTML = `
            <button id="login-btn">
                <i class="fas fa-user-circle"></i>
            </button>
        `;

        document.getElementById('login-btn').addEventListener('click', showLoginPopup);
    }

    // Fonction pour afficher le formulaire de login
    function showLoginPopup() {
        fetch('login.html') // Chargez le contenu du formulaire de login
            .then(response => response.text())
            .then(content => {
                popupContainer.innerHTML = content;
                popupContainer.style.display = 'block';
                overlay.style.display = 'block';

                // Ajouter un événement pour fermer la popup
                document.getElementById('close-popup').addEventListener('click', closePopup);

                // Ajouter la gestion de la soumission du formulaire
                document.getElementById('login-form').addEventListener('submit', handleLogin);
            });
    }

    // Fonction pour fermer la popup
    function closePopup() {
        popupContainer.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Gestion de la soumission du formulaire de connexion
    async function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Stockez le token JWT dans localStorage
                localStorage.setItem('token', data.token);

                // Fermez la popup et affichez les informations utilisateur
                closePopup();
                displayUserInfo(data.user);
            } else {
                alert(data.error || 'Erreur de connexion.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Impossible de se connecter pour le moment.');
        }
    }

    // Afficher les informations utilisateur
    function displayUserInfo(user) {
        userSection.innerHTML = `
            <div class="user-info">
                <span class="user-name">${user.username}</span>
                <button id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        `;

        // Gérer la déconnexion
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }

    // Fonction pour gérer la déconnexion
    function handleLogout() {
        localStorage.removeItem('token');
        displayLoginButton();
    }

    // Fonction pour récupérer les détails de l'utilisateur connecté
    async function fetchUserDetails(token) {
        try {
            const response = await fetch('http://localhost:4000/api/users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                displayUserInfo(data.user);
            } else {
                // Si le token est invalide ou expiré, affichez le bouton Login
                displayLoginButton();
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des détails utilisateur:', error);
            displayLoginButton();
        }
    }
});
