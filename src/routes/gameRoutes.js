const express = require('express');
const router = express.Router();
const { getGames } = require('../services/gameService');

router.get('/games', (req, res) => {
    const games = getGames();
    res.json(games);
});

module.exports = router;
