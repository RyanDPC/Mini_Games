document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const openLoginButton = document.getElementById('open-login-btn');
    const loginButton = document.getElementById('login-btn'); // Correctement intégré
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const logoutButton = document.getElementById('logout-btn');
    const profileFriendsSection = document.getElementById('profile-friends-section');

    const apiUrl = window.location.origin.includes('localhost')
        ? 'https://localhost:4000/api'
        : 'https://localhost:3000/api';

    console.log("Script chargé. API URL :", apiUrl);
    
    if (openLoginButton) {
        openLoginButton.addEventListener('click', () => {
            console.log("Redirection vers la page de connexion...");
            window.location.href = '/login';
        });
    } else {
        console.error("Le bouton 'open-login-btn' est introuvable.");
    }

    // Met à jour l'interface utilisateur en fonction de l'état de connexion
    async function updateUIForUser() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.token) {
        console.error("Erreur : Utilisateur non connecté (token manquant).");
        localStorage.removeItem('user');
        profileFriendsSection?.style.setProperty('display', 'none');
        return;
    }

    try {
        const response = await fetchWithTokenRefresh(`${apiUrl}/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`, // Assurez-vous que le token est inclus ici
            },
        });

        const data = await response.json();

        const profilePicElement = document.getElementById('profile-pic');
        const usernameSpan = document.getElementById('username-span');

        if (profilePicElement && usernameSpan) {
            profilePicElement.src = data.user.profile_pic || '/assets/default-avatar.png';
            usernameSpan.textContent = data.user.username;
        }

        profileFriendsSection?.style.setProperty('display', 'block');
        console.log('Profil utilisateur mis à jour avec succès.');
    } catch (error) {
        console.error("Erreur :", error);
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

    // Affiche un message d'erreur dans l'élément spécifié
    function showError(message, errorElement) {
        if (errorElement) {
            console.error("Erreur :", message);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Rafraîchit le token d'accès
    async function refreshAccessToken() {
        try {
            const response = await fetch(`${apiUrl}/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Échec du rafraîchissement du token.');
            }

            console.log("Token d'accès rafraîchi avec succès.");
        } catch (error) {
            console.error("Erreur lors du rafraîchissement du token :", error);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }

    // Intercepte les erreurs liées au token expiré
    async function fetchWithTokenRefresh(url, options) {
        try {
            const response = await fetch(url, options);

            if (response.status === 403) {
                console.log("Token expiré. Tentative de rafraîchissement...");
                await refreshAccessToken();
                return fetch(url, options); // Réessayer après le rafraîchissement
            }

            return response;
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
            throw error;
        }
    }

    // Gestion de la connexion
    if (loginButton && loginForm) {
        loginButton.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log("Tentative de connexion...");

            const username = loginForm.querySelector('#login-username').value.trim();
            const password = loginForm.querySelector('#login-password').value.trim();

            if (!username || !password) {
                showError('Veuillez remplir tous les champs.', loginError);
                return;
            }

            try {
                console.log("Envoi des informations de connexion au serveur...");
                const response = await fetch(`${apiUrl}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include', // Inclut les cookies dans la requête
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Connexion réussie :", data);
                    window.location.href = `/?username=${encodeURIComponent(data.user.username)}`;
                } else {
                    throw new Error(data.message || 'Erreur lors de la connexion.');
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
                showError(error.message, loginError);
            }
        });
    }

    // Gestion de l'inscription
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();

            if (!username || !email || !password) {
                showError('Tous les champs sont requis.', registerError);
                return;
            }

            try {
                console.log("Envoi des informations d'inscription au serveur...");
                const response = await fetch(`${apiUrl}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("Inscription réussie :", data);
                    window.location.href = `/login`;
                } else {
                    throw new Error(data.message || 'Erreur lors de l\'inscription.');
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription :", error);
                showError(error.message, registerError);
            }
        });
    }

    // Gestion de la déconnexion
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            console.log("Déconnexion en cours...");
            await fetch(`${apiUrl}/users/logout`, { method: 'GET', credentials: 'include' });
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
    }

    // Vérifier l'utilisateur connecté au chargement
    updateUIForUser();
});
