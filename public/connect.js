document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments DOM nécessaires
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const openLoginButton = document.getElementById('open-login-btn');
    const loginButton = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const logoutButton = document.getElementById('logout-btn');
    const profileFriendsSection = document.getElementById('profile-friends-section');
    const user = JSON.parse(localStorage.getItem('user'));

    const apiUrl = window.location.origin.includes('localhost')
        ? 'https://localhost:4000/api/users'
        : 'https://localhost:3000/api/users';

    console.log("Script chargé. API URL : ", apiUrl);

    // Fonction pour afficher un message d'erreur
    function showError(message, errorElement) {
        console.error("Erreur : ", message);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Vérifie si l'utilisateur est connecté
    console.log("Utilisateur connecté : ", user);

    if (profileFriendsSection) {
        if (user) {
            console.log("Utilisateur détecté, affichage de la section amis.");
            profileFriendsSection.style.display = 'block';

            const profilePicElement = document.getElementById('profile-pic');
            const usernameSpan = document.getElementById('username-span');
            if (profilePicElement && usernameSpan) {
                profilePicElement.src = user.profile_pic || '/assets/default-pic.jpg'; // Image par défaut si absente
                usernameSpan.textContent = user.username || 'Utilisateur inconnu';
            }
        } else {
            console.log("Aucun utilisateur détecté, masquage de la section amis.");
            profileFriendsSection.style.display = 'none';
        }
    }

    // Gestion du bouton pour ouvrir le formulaire de connexion
    if (openLoginButton) {
        openLoginButton.addEventListener('click', () => {
            console.log("Ouverture du formulaire de connexion.");
            window.location.href = '/login';
        });
    }

    // Gestion du bouton de connexion dans le formulaire
    if (loginButton) {
        loginButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log("Tentative de connexion...");

            if (!loginForm) {
                console.error("Formulaire de connexion introuvable.");
                return;
            }

            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!username || !password) {
                showError('Veuillez remplir tous les champs.', loginError);
                return;
            }

            try {
                console.log("Envoi des informations de connexion au serveur...");
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include', // Inclure les cookies (refresh token)
                });

                const data = await response.json();
                console.log("Réponse du serveur : ", data);

                if (response.ok) {
                    console.log("Connexion réussie. Stockage de l'utilisateur...");
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = `/?username=${encodeURIComponent(data.user.username)}`;
                } else {
                    showError(data.message || 'Erreur de connexion.', loginError);
                }
            } catch (error) {
                console.error("Erreur lors de la connexion : ", error);
                showError('Une erreur est survenue. Veuillez réessayer.', loginError);
            }
        });
    }

    // Gestion du formulaire d'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Soumission du formulaire d'inscription.");

            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const email = document.getElementById('register-email').value.trim();

            if (!username || !password || !email) {
                showError('Veuillez remplir tous les champs.', registerError);
                return;
            }

            try {
                console.log("Envoi des informations d'inscription au serveur...");
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, email }),
                });

                const data = await response.json();
                console.log("Réponse du serveur : ", data);

                if (response.ok) {
                    console.log("Inscription réussie. Stockage de l'utilisateur...");
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = `/?username=${encodeURIComponent(data.user.username)}`;
                } else {
                    showError(data.message || 'Erreur d\'inscription.', registerError);
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription : ", error);
                showError('Une erreur est survenue. Veuillez réessayer.', registerError);
            }
        });
    }

    // Gestion de la déconnexion
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            console.log("Déconnexion en cours...");
            try {
                await fetch(`${apiUrl}/logout`, {
                    method: 'POST',
                    credentials: 'include', // Inclure les cookies pour supprimer le refresh token côté serveur
                });
            } catch (error) {
                console.error("Erreur lors de la déconnexion : ", error);
            } finally {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        });
    }
});
