const express = require("express");
const { updateTokens } = require("../controllers/tokenController");

const router = express.Router();

router.put("/", updateTokens);

module.exports = router;
