const express = require("express");
const router = express.Router();

const panController = require("../controllers/pan.controller");

router.post("/register-pan", panController.registerPan);

module.exports = router;
