const express = require("express");
const router = express.Router();
const {
  checkLivelinessController,
} = require("../../controllers/liveliness.controller");

// POST /api/liveliness
router.post("/liveliness_check", checkLivelinessController);

module.exports = router;
