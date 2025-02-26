const ProfileDetail = require("../models/profile.model");

module.exports.createProfile = async (req, res) => {
  try {
    const {
      gender,
      placeOfBirth,
      occupation,
      annualIncome,
      citizenship,
      informationConfirmation,
    } = req.body;

    const newProfile = new ProfileDetail({
      gender,
      placeOfBirth,
      occupation,
      annualIncome,
      citizenship,
      informationConfirmation,
    });

    await newProfile.save();

    return res.status(201).json({
      message: "Profile successfully created!",
      data: newProfile,
    });
  } catch (error) {
    console.error("Error in createProfile:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Error creating profile",
      error: error.message,
    });
  }
};
