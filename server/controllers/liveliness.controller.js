const { checkLivelinessService } = require("../services/liveliness.service");
const { generateVerificationId } = require("../utils/generateVeficationId");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const User = require("../models/updated_user.model");
const axios = require("axios");

exports.checkLivelinessController = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const userId = req.user._id;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL is required" });
    }

    // Download image as buffer
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(imageRes.data, "binary");

    // Upload buffer to Cloudinary
    const uploaded = await uploadImageToCloudinary(
      imageBuffer,
      process.env.FOLDER_NAME
    );

    // Generate verification ID
    const verificationId = generateVerificationId();

    // Call liveliness service with buffer
    const result = await checkLivelinessService(imageBuffer, verificationId);

    // Handle liveliness results
    if (result.status === "Multiple Face Detected") {
      return res.status(400).json({
        success: false,
        message: "Liveliness check failed - Multiple faces detected",
        error: result.message || "Unknown error",
      });
    }

    if (result.status === "Face not detected") {
      return res.status(400).json({
        success: false,
        message: "Liveliness check failed - Face not detected",
        error: result.message || "Unknown error",
      });
    }

    // Update user image URL in DB
    await User.findByIdAndUpdate(
      userId,
      { $set: { userImage: uploaded.secure_url } },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Controller Error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Liveliness check failed",
      error: error.response?.body || error.message,
    });
  }
};
