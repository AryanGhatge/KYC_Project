const PanInfo = require("../models/pan.models");

module.exports.registerPan = async (req, res) => {
  try {
    const { panNumber, mobileNo, dateOfBirth, email, iAm } = req.body;

    // Check if PAN already exists
    const existingPan = await PanInfo.findOne({ panNumber });
    if (existingPan) {
      return res.status(400).json({
        message: "PAN details already exists",
      });
    }

    // Store in DB using create()
    const newPanInfo = await PanInfo.create({
      panNumber,
      mobileNo,
      dateOfBirth,
      email,
      iAm,
    });

    return res.status(201).json({
      message: "Pan info successfully registered!",
      data: newPanInfo,
    });
  } catch (error) {
    console.error("Error in registerPan:", error);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error registering PAN info",
      error: error.message,
    });
  }
};
