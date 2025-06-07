const { checkLivelinessService } = require("../services/liveliness.service");

exports.checkLivelinessController = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const imageFile = req.files.image;
    const verificationId = "cbcc7452"; // Or dynamically set this based on session/user

    const result = await checkLivelinessService(imageFile, verificationId);
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
