const User = require("../models/updated_user.model");
const { validatePanDetails } = require("../services/panValidation.service");
//const { validateBankDetails } = require("../services/bankValidationService.js");

exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user._id;
    const updateData = { ...req.body };

    // Prevent overwriting sensitive fields
    delete updateData.email;
    delete updateData.password;

    // //  Validate PAN (if available)
    // if (
    //   updateData.panDetails?.panNumber &&
    //   updateData.panDetails?.dateOfBirth
    // ) {
    //   const panResponse = await validatePanDetails({
    //     pan: updateData.panDetails.panNumber,
    //     dob: updateData.panDetails.dateOfBirth,
    //   });

    //   if (panResponse.status !== "SUCCESS") {
    //     return res.status(400).json({
    //       success: false,
    //       message: "PAN validation failed",
    //       data: panResponse,
    //     });
    //   }
    // }

    // //  Validate Bank (if available)
    // const primaryBank = updateData.bankDetails?.find((b) => b.primary);
    // if (
    //   primaryBank?.bankAccountNumber &&
    //   primaryBank?.ifscCode &&
    //   updateData.name
    // ) {
    //   const bankResponse = await validateBankDetails({
    //     account_number: primaryBank.bankAccountNumber,
    //     ifsc: primaryBank.ifscCode,
    //     name: updateData.name,
    //   });

    //   if (bankResponse.status !== "SUCCESS") {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Bank validation failed",
    //       data: bankResponse,
    //     });
    //   }
    // }

    //  Update user after validations pass
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //  Refresh session to reflect changes immediately
    req.login(updatedUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Session update failed" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
