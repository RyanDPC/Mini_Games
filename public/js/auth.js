document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const popupContainer = document.getElementById('popup-container');
    const overlay = document.getElementById('overlay');
    const userSection = document.getElementById('user-section');

    // Fonction pour charger dynamiquement un fichier HTML
    const loadPopupContent = async (file) => {
        const response = await fetch(file);
        const content = await response.text();
        popupContainer.innerHTML = content;
        popupContainer.style.display = 'block';
        overlay.style.display = 'block';

        // Ajouter la gestion de fermeture dans le popup chargé
        document.getElementById('close-popup').addEventListener('click', closePopup);

        // Ajouter la gestion de la connexion et l'inscription
        addAuthHandlers();
    };

    // Fonction pour fermer la popup
    const closePopup = () => {
        popupContainer.style.display = 'none';
        overlay.style.display = 'none';
    };

    // Écouteur pour afficher la popup de login
    loginBtn.addEventListener('click', () => {
        loadPopupContent('login.html');
    });

    // Fermeture via l'overlay
    overlay.addEventListener('click', closePopup);

    // Ajouter la gestion de la connexion et de l'inscription
    function addAuthHandlers() {
        // Gestion de la connexion
        document.querySelector('.btn-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Envoyer les données au serveur pour vérifier les identifiants
            fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Connexion réussie');
                    closePopup();
                    displayUserInfo(data.user);
                }
            })
            .catch(err => {
                console.error('Erreur:', err);
                alert('Une erreur est survenue lors de la connexion.');
            });
        });

        // Gestion de l'inscription
        document.querySelector('.btn-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            // Envoyer les données au serveur
            fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Inscription réussie');
                    closePopup();
                }
            })
            .catch(err => {
                console.error('Erreur:', err);
                alert('Une erreur est survenue lors de l\'inscription.');
            });
        });
    }

    // Afficher les informations utilisateur après la connexion
    function displayUserInfo(user) {
        userSection.innerHTML = `
            <div class="user-info">
                <img src="${user.profilePicture || 'https://via.placeholder.com/50'}" alt="${user.username}" class="user-avatar">
                <span class="user-name">${user.username}</span>
                <button id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
            </div>
        `;

        // Gérer la déconnexion
        document.getElementById('logout-btn').addEventListener('click', () => {
            userSection.innerHTML = `
                <button id="login-btn">
                    <i class="fas fa-user-circle"></i>
                </button>
            `;
            document.getElementById('login-btn').addEventListener('click', () => {
                loadPopupContent('login.html');
            });
        });
    }
});
