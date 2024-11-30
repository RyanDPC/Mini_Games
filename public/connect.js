document.addEventListener('DOMContentLoaded', () => {
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
    const usernameSpan = document.getElementById('username');
    const logoutButton = document.getElementById('logout-btn');
    const savedUser = localStorage.getItem('user');
    let isLoginMode = true;
    if (savedUser) {
        const user = JSON.parse(savedUser);
        // Afficher la section profil et masquer la popup
        profileSection.style.display = 'block';
        usernameSpan.innerText = user.username;

        // Mettre à jour l'image de profil
        profilePic.src = `/assets/pdp/${user.profilePic}`;

        // Masquer le bouton de login
        openLoginButton.style.display = 'none';
    }
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
        const body = isLoginMode ? { username, password } : { username, password, email };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (data.username) {
                // Afficher la section profil et masquer la popup
                profileSection.style.display = 'block';
                usernameSpan.innerText = data.username;
    
                // Mettre à jour l'image de profil avec une image aléatoire
                const profilePics = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
                const randomProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
                profilePic.src = `/assets/pdp/${randomProfilePic}`;
    
                // Masquer la popup de connexion
                openLoginButton.style.display = 'none';
    
                // Sauvegarder l'état de l'utilisateur dans localStorage
                localStorage.setItem('user', JSON.stringify({ username: data.username, profilePic: randomProfilePic }));
            } else {
                loginErrorMessage.innerText = data.error || "Une erreur est survenue.";
                loginErrorMessage.style.display = 'block';
            }
        } catch (error) {
            loginErrorMessage.innerText = "Erreur lors de la connexion ou de l'inscription.";
            loginErrorMessage.style.display = 'block';
        }
    });

    // Déconnexion de l'utilisateur
    logoutButton.addEventListener('click', () => {
        profileSection.style.display = 'none';
        openLoginButton.style.display = 'block';
    // Supprimer l'utilisateur du localStorage
        localStorage.removeItem('user');
    });
});
