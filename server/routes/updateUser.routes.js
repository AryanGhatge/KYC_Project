const express = require("express");
const router = express.Router();
const { updateUserProfile } = require("../controllers/updateData.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

// Update profile (user must be logged in)
router.put("/update_data", isAuthenticated, updateUserProfile);

module.exports = router;
