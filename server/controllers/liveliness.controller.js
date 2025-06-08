const { checkLivelinessService } = require("../services/liveliness.service");
const { generateVerificationId } = require("../utils/generateVeficationId");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const User = require("../models/updated_user.model");

exports.checkLivelinessController = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const imageFile = req.files.image;
    const userId = req.user._id;

    // ✅ Fixed: Use imageFile, not 'thumbnail'
    const uploaded = await uploadImageToCloudinary(
      imageFile,
      process.env.FOLDER_NAME
    );

    const clientId = process.env.CF_CLIENT_ID;
    const publicKeyPath = process.env.CF_PUBLIC_KEY_PATH;
    const verificationId = generateVerificationId();

    const result = await checkLivelinessService(imageFile, verificationId);

    if (result.status == "Multiple Face Detected") {
      return res.status(400).json({
        success: false,
        message: "Liveliness check failed - Multiple faces detected",
        error: result.message || "Unknown error",
      });
    }

    if (result.status == "Face not detected") {
      return res.status(400).json({
        success: false,
        message: "Liveliness check failed - Face not detected",
        error: result.message || "Unknown error",
      });
    }

    // ✅ Update user's ImageUrl
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { userImage: uploaded.secure_url } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Controller Error:", error.message || error);
    res.status(500).json({
      success: false,
      message: "Liveliness check failed",
      error: error.response?.body || error.message,
    });
  }
};
