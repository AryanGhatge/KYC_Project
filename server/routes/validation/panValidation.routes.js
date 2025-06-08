const express = require("express");
const router = express.Router();
const { verifyPanSandbox } = require("../../services/panValidation.service");
const { generateVerificationId } = require("../../utils/generateVeficationId");


router.post("/verify-pan", async (req, res) => {
  let { pan, verification_id, name } = req.body;
  console.log(req.body);
  if (!pan || !name) {
    return res.status(400).json({ message: "PAN and Name are required" });
  }


  verification_id = await generateVerificationId();
  console.log("Generated Verification ID:", verification_id);

  try {
    const response = await verifyPanSandbox({ pan, verification_id, name });
    console.log("PAN verification response:", response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error during PAN verification",
      error: error.message,
    });
  }
});

module.exports = router;
