const express = require("express");

const router = express.Router();

const ttsController = require("../controllers/tts-controller");

router.post("/", ttsController.textToSpeech);

module.exports = router;
