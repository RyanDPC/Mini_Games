document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup-container');
    const openLoginButton = document.getElementById('open-login-btn');
    const closePopupButton = document.getElementById('close-popup');
    const authForm = document.getElementById('auth-form');
    const toggleFormButton = document.getElementById('toggle-form-btn');
    const authButton = document.getElementById('auth-btn');
    const loginErrorMessage = document.getElementById('login-error');
    const profileSection = document.getElementById('profile-section');
    const profilePic = document.getElementById('profile-pic');
    const usernameSpan = document.getElementById('username-span');
    const logoutButton = document.getElementById('logout-btn');

    let isLoginMode = true;

    // Vérifier si un utilisateur est connecté
    if (savedUser) {
        const user = JSON.parse(savedUser);
        showUserProfile(user);  // Afficher le profil si l'utilisateur est connecté
    } else {
        hideUserProfile();  // Masquer le profil si aucun utilisateur n'est connecté
    }

    // Fonction pour afficher le profil de l'utilisateur
    function showUserProfile(user) {
        // Afficher l'image de profil
        profilePic.src = `/assets/pdp/${user.profile_pic}`;

        // Afficher le nom de l'utilisateur
        usernameSpan.innerText = user.username;

        // Afficher la section de profil et masquer le bouton de connexion
        profileSection.style.display = 'block';
        openLoginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    }

    // Fonction pour masquer le profil
    function hideUserProfile() {
        profileSection.style.display = 'none';
        openLoginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    // Gestion de la déconnexion
    logoutButton.addEventListener('click', () => {
        // Supprimer l'utilisateur du localStorage
        localStorage.removeItem('user');
        hideUserProfile();  // Masquer le profil après déconnexion
    });

    // Fonction pour basculer entre l'inscription et la connexion
    toggleFormButton.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            document.getElementById('form-title').innerText = 'Se connecter';
            document.getElementById('email-container').style.display = 'none';  // Masquer le champ email
            authButton.innerText = 'Se connecter';
            toggleFormButton.innerText = 'Créer un compte';
        } else {
            document.getElementById('form-title').innerText = 'S\'inscrire';
            document.getElementById('email-container').style.display = 'block';  // Afficher le champ email
            authButton.innerText = 'S\'inscrire';
            toggleFormButton.innerText = 'Déjà un compte ? Se connecter';
        }
    });

    // Ouvrir la popup de connexion lorsque le bouton "Se connecter" est cliqué
    openLoginButton.addEventListener('click', () => {
        overlay.style.display = 'block';  // Afficher le fond d'écran gris
        popupContainer.style.display = 'block';  // Afficher la popup
    });

    // Fermer la popup lorsque le bouton "Fermer" est cliqué
    closePopupButton.addEventListener('click', () => {
        overlay.style.display = 'none';  // Cacher le fond d'écran
        popupContainer.style.display = 'none';  // Cacher la popup
    });

    // Fermer la popup si on clique sur le fond (overlay)
    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';  // Cacher le fond d'écran
        popupContainer.style.display = 'none';  // Cacher la popup
    });

    // Gestion de la soumission du formulaire de connexion ou d'inscription
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const email = document.getElementById('email') ? document.getElementById('email').value.trim() : null;

        // Vérification des champs vides
        if (!username || !password || (!isLoginMode && !email)) {
            loginErrorMessage.innerText = "Veuillez remplir tous les champs.";
            loginErrorMessage.style.display = 'block';
            return;
        }

        const apiUrl = isLoginMode ? 'https://localhost:4000/api/users/login' : 'https://localhost:4000/api/users/register';
        const userData = { username, password, email };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.token) {
                // Enregistrer les informations de l'utilisateur dans localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = `/?username=${data.user.username}`;
                // Fermer la popup et afficher le profil
                overlay.style.display = 'none';
                popupContainer.style.display = 'none';
                showUserProfile(data.user);
            } else {
                loginErrorMessage.innerText = data.message;
                loginErrorMessage.style.display = 'block';
            }
        } catch (error) {
            loginErrorMessage.innerText = "Erreur serveur, veuillez réessayer.";
            loginErrorMessage.style.display = 'block';
        }
    });
});
