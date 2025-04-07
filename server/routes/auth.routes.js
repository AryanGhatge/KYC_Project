const express = require("express");
const passport = require("passport");
const { register, login, logout } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      // Log user in manually to create session
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({ message: "Login successful", user, success: true });
      });
    })(req, res, next);
  });
  router.post("/logout", logout);

module.exports = router;