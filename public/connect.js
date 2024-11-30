document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const popupContainer = document.getElementById('popup-container');
    const openLoginButton = document.getElementById('open-login-btn');
    const closePopupButton = document.getElementById('close-popup');
    const loginForm = document.getElementById('login-form');
    const signupButton = document.getElementById('signup'); 
    const profileSection = document.getElementById('profile-section');
    const profilePic = document.getElementById('profile-pic');
    const usernameSpan = document.getElementById('username');
    const loginErrorMessage = document.getElementById('login-error');

    // Function to update the interface after login
    function handleLogin(username, profilePicUrl) {
        // Hide the login button and display the profile section
        openLoginButton.style.display = 'none';
        profileSection.style.display = 'block';

        // Update profile picture and username
        profilePic.src = profilePicUrl || 'assets/pdp/1.png'; // Default to profile picture 1 if no URL
        usernameSpan.innerText = username; // Display the username
    }

    // Open login popup
    openLoginButton.addEventListener('click', () => {
        overlay.classList.add('active');
        popupContainer.classList.add('active');
    });

    // Close login popup
    closePopupButton.addEventListener('click', () => {
        overlay.classList.remove('active');
        popupContainer.classList.remove('active');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            loginErrorMessage.innerText = "Please enter both username and password!";
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (data.success) {
                handleLogin(username, data.profilePicUrl);
                overlay.classList.remove('active');
                popupContainer.classList.remove('active');
            } else {
                loginErrorMessage.innerText = data.message;
            }
        } catch (error) {
            loginErrorMessage.innerText = "An error occurred, please try again!";
        }
    });

    // Signup button logic (optional based on your app's flow)
    signupButton.addEventListener('click', () => {
        alert("Sign up functionality coming soon!");
    });
});
