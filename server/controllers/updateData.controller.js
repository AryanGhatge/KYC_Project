const got = require("got");
const User = require("../models/updated_user.model");

const PORT = process.env.PORT || 8080;


exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user._id;
    const updateData = req.body;

    // Prevent overwriting sensitive fields
    delete updateData.email;
    delete updateData.password;

    // 🟡 Extract PAN and Name to send to PAN verification API
    const panNumber = updateData?.panDetails?.panNumber;
    const name = updateData?.panDetails?.name;

    if (panNumber && name) {
      try {
        const panResponse = await got.post(
          `http://localhost:${PORT}/v1/validation/verify-pan`,
          {
            json: {
              pan: panNumber,
              name: name,
              verification_id: "auto-gen-verification-id",
            },
            responseType: "json",
          }
        );

        console.log("✅ PAN verification response:", panResponse.body);

        if (panResponse.body.status !== "VALID") {
          return res.status(400).json({
            success: false,
            message: "PAN verification failed. Please check your PAN details.",
            data: panResponse.body,
          });
        }
      } catch (apiError) {
        console.error(
          "❌ PAN verification API error:",
          apiError.response?.body || apiError.message
        );
        return res.status(500).json({
          success: false,
          message: "Failed to verify PAN with external API.",
        });
      }
    }

    // Update bank validation 
    // extract primary bank validation
    const bank = updatedDate?.bank[0];
    if(!bank) {
      return res.status(404).json({
        sucess:false,
        message:"Bank Account required"
      })
    }

    const bank_account = bank.bankAccountNumber;
    const ifsc = bank.ifscCode;

    if(bank_account && ifsc) {
      console.log("Doing bank verification");

      try {
        const bankResponse = await got.post(
          `http://localhost:${PORT}/v1/validation/verify-bank`,
          {
            json: {
              bank_account : bank_account,
              ifsc : ifsc,
              name : name,
              verification_id: "auto-gen-verification-id",
            },
            responseType: "json",
          }
        );

        console.log("✅ Bank verification response:", bankResponse.body);

        if (bankResponse.body.status !== "VALID") {
          return res.status(400).json({
            success: false,
            message: "Bank verification failed. Please check your Bank details.",
            data: bankResponse.body,
          });
        }
      } catch (apiError) {
        console.error(
          "❌ Bank verification API error:",
          apiError.response?.body || apiError.message
        );
        return res.status(500).json({
          success: false,
          message: "Failed to verify Bank with external API.",
        });
      }

    }

    // 🔁 Update user after validation
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

    // 🔄 Refresh session to reflect latest user
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
