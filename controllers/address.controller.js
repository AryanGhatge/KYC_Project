const addressModel = require("../models/address.model");

module.exports.registerAddress = async (req, res) => {
  try {
    const {
      permanentAddress,
      landmark,
      permanentCity,
      permanentPincode,
      permanentState,
      permanentCountry,
    } = req.body;

    const addressInfo = await addressModel.create({
      permanentAddress,
      landmark,
      permanentCity,
      permanentPincode,
      permanentState,
      permanentCountry,
    });

    return res.status(201).json({
      message: "Address successfully registered!",
      data: addressInfo,
    });
  } catch (error) {
    console.error("Error in address registration:", error);

    // Check if it's a validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error registering address",
      error: error.message,
    });
  }
};
