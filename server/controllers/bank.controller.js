const Bank = require("../models/bank.model");

module.exports.registerBank = async (req, res) => {
  try {
    const { bankName, accountType, bankAccountNumber, ifscCode, primary } =
      req.body;

    // Check if Bank already exists
    const existingBank = await Bank.findOne({ bankAccountNumber });
    if (existingBank) {
      return res.status(400).json({
        message: "Bank details already exists",
      });
    }

    // Store in DB using create()
    const bankInfo = await Bank.create({
      bankName,
      accountType,
      bankAccountNumber,
      ifscCode,
      primary,
    });

    return res.status(201).json({
      message: "Bank info successfully registered!",
      data: bankInfo,
    });
  } catch (error) {
    console.error("Error in register Bank:", error);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error registering Bank info",
      error: error.message,
    });
  }
};
