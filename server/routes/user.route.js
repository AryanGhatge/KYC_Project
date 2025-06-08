const express = require("express");
const router = express.Router();
const { getUserDetailsController } = require("../controllers/user.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

router.get("/getDetails", isAuthenticated, getUserDetailsController);

module.exports = router;
