const express = require("express");

const router = express.Router();

const sttController = require("../controllers/stt-controller");

router.post("/", sttController.speechToText);

module.exports = router;
