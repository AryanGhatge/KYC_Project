const User = require("../models/updated_user.model");
exports.getUserDetailsController = async (req, res) => {
  try {
    const userId = req.user._id; // get user id from authenticated session

    const user = await User.findById(userId).select("-password");
    // exclude password field for security reasons

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};
