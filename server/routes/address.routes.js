const express = require("express");
const addressController = require("../controllers/address.controller");
const router = express.Router();

router.post("/register-address", addressController.registerAddress);

module.exports = router;
