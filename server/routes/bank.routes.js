const express = require("express");
const bankController = require("../controllers/bank.controller");
const router = express.Router();

router.post("/register-bank", bankController.registerBank);

module.exports = router;
