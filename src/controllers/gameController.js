
exports.startGame = (req, res) => {
  res.send('Nouvelle partie de Tic Tac Toe démarrée');
};

exports.makeMove = (req, res) => {
  const { player, position } = req.body;
  res.send(`Le joueur ${player} a joué à la position ${position}`);
};
