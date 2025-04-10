const User = require("../models/updated_user.model");
const { uploadImage } = require("./imageUploadController");

exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user._id; // Extract user ID from session
    const updateData = req.body;

    const image1 = await uploadImage(req.files.bank);
    const image2 = await uploadImage(req.files.dmat);

    // Exclude sensitive fields from updates
    delete updateData.email;
    delete updateData.password;

    //updating images
    updateData.uploadCanceledCheque = image1;
    updateData.clientMasterCopy = image2;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Update only provided fields
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Reattach user session with updated details
    req.login(updatedUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Session update failed" });
      }
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
