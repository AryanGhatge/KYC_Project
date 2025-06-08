const express = require("express");
const router = express.Router();
const {validateBankDetails} = require("../../services/bankValidation.service")
const {generateVerificationId} = require("../../utils/generateVeficationId")


router.post("/verify-bank", async (req, res) => {
  let { bank_account, ifsc, name, verification_id } = req.body;

  if (!bank_account || !name || !ifsc) {
    return res.status(400).json({ message: "Bank Account, IFSC Code and Name are required" });
  }

    verification_id = generateVerificationId();
  

  try {
    const response = await validateBankDetails({ bank_account, ifsc, name, verification_id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error during Bank verification",
      error: error.message,
    });
  }
});

module.exports = router;
