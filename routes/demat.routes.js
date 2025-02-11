const express = require("express");
const multer = require("multer");
const dematController = require("../controllers/demat.controller");
const router = express.Router();

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/register-demat",
  upload.single("clientMasterCopy"),
  dematController.registerDemat
);

module.exports = router;
