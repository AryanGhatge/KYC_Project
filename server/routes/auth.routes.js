const express = require("express");
const passport = require("passport");
const { register, login, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", passport.authenticate("local"), login);
router.post("/logout", logout);

module.exports = router;
