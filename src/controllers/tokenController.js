const db = require("../../config/database");

function updateTokens(req, res) {
    const { username, tokens } = req.body;

    db.run(`UPDATE users SET tokens = ? WHERE username = ?`, [tokens, username], function (err) {
        if (err) return res.status(400).json({ error: "Erreur lors de la mise à jour des jetons." });
        res.json({ message: "Jetons mis à jour." });
    });
}

module.exports = { updateTokens };
