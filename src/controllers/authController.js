const bcrypt = require("bcrypt");
const { createUser, findUserByUsername } = require("../models/userModel");

function register(req, res) {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    createUser(username, hashedPassword, (err, userId) => {
        if (err) return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé." });
        res.json({ message: "Inscription réussie", userId });
    });
}

function login(req, res) {
    const { username, password } = req.body;

    findUserByUsername(username, (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Utilisateur non trouvé." });

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Mot de passe incorrect." });

        res.json({ message: "Connexion réussie", user });
    });
}

module.exports = { register, login };
