const Demat = require("../models/demat.model");

// Register a new Demat account
module.exports.registerDemat = async (req, res) => {
  try {
    const { depository, dpID, clientID, primary } = req.body;
    const clientMasterCopy = req.file ? req.file.buffer : null; // Handling file upload

    const dematInfo = await Demat.create({
      depository,
      dpID,
      clientID,
      primary,
      clientMasterCopy,
    });

    return res.status(201).json({
      message: "Demat account successfully registered!",
      data: dematInfo,
    });
  } catch (error) {
    console.error("Error in Demat registration:", error);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error registering Demat account",
      error: error.message,
    });
  }
};
