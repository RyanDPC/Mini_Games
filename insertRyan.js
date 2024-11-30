const bcrypt = require('bcrypt');
const db = require('./config/db'); // Connexion à la base de données

// Liste des images de profil disponibles
const profilePictures = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

// Hacher le mot de passe "mdp"
const hashedPassword = bcrypt.hashSync('mdp', 10);

// Sélectionner une image de profil aléatoire parmi les options
const profilePicture = profilePictures[Math.floor(Math.random() * profilePictures.length)];

// Insérer l'utilisateur Ryan avec 10000 tokens
const username = 'Ryan';
const email = 'Ryan.games@test.ch';
const tokens = 10000;

const sql = 'INSERT INTO users (username, password, email, profile_pic, tokens) VALUES (?, ?, ?, ?, ?)';

// Insertion dans la base de données
db.run(sql, [username, hashedPassword, email, profilePicture, tokens], function(err) {
    if (err) {
        console.error("Erreur lors de l'insertion de l'utilisateur Ryan : ", err);
    } else {
        console.log("Utilisateur Ryan ajouté avec succès !");
    }
});
