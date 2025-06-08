const express = require("express");
const router = express.Router();
const {validateOCRDetails} = require("../../services/ocrValidation.service");
const {generateVerificationId} = require("../../utils/generateVeficationId");


router.post("/verify-ocr", async (req, res) => {
  let {document_type, file_url, verification_id } = req.body;

  if (!file_url) {
    return res.status(400).json({ message: "File_Url is required" });
  }

  if (!verification_id) {
    verification_id = generateVerificationId();
  }
  //hard coding document_type for now as CANCELLED_CHEQUE can be dynamically done using document_type variable
  try {
    const response = await validateOCRDetails({ document_type : "CANCELLED_CHEQUE", file_url, verification_id });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error during OCR verification",
      error: error.message,
    });
  }
});

module.exports = router;
