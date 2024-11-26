const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data/mini_games.db", (err) => {
    if (err) console.error("Erreur de connexion :", err.message);
    else console.log("Connexion réussie à SQLite.");
});

module.exports = db;
