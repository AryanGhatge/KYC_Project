const got = require("got");
const User = require("../models/updated_user.model");

const PORT = process.env.PORT || 8080;

exports.updateUserProfile = async (req, res) => {
  // console.log("🔵 Update request received");
  // console.log("Request body:", JSON.stringify(req.body, null, 2));
  // console.log("User in session:", req.user?._id);

  try {
    if (!req.user) {
      // console.log("❌ No user found in session");
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const userId = req.user._id;
    const updateData = req.body;

    // console.log("Processing update for user:", userId);
    // console.log(
    //   "Demat details received:",
    //   JSON.stringify(updateData.dematDetails, null, 2)
    // );

    // Validate demat details if present
    if (updateData.dematDetails && updateData.dematDetails.length > 0) {
      const invalidDematAccounts = updateData.dematDetails.filter(
        (account) =>
          account.primary &&
          (!account.clientMasterCopy || account.clientMasterCopy.trim() === "")
      );

      if (invalidDematAccounts.length > 0) {
        // console.log("❌ Invalid demat accounts found:", invalidDematAccounts);
        return res.status(400).json({
          success: false,
          message: "Client master copy is required for primary demat account",
        });
      }
    }

    // 🟡 Extract PAN and Name to send to PAN verification API
    const panNumber = updateData?.panDetails?.panNumber;
    const name = updateData?.name;

    // console.log("PAN Number:", panNumber);
    // console.log("Name:", name);
    if (panNumber && name) {
      // console.log("🔄 Starting PAN verification process...");
      try {
        // console.log(
        //   `Sending PAN verification request to: http://localhost:${PORT}/v1/validation/verify-pan`
        // );
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

        console.log("✅ PAN verification response received:", panResponse.body);

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

    // console.log("PAN verification completed successfully");

    // Update bank validation
    // extract primary bank validation
    const bank = updateData?.bankDetails[0];
    if (!bank) {
      return res.status(404).json({
        sucess: false,
        message: "Bank Account required",
      });
    }

    const bank_account = bank.bankAccountNumber;
    const ifsc = bank.ifscCode;

    // console.log("Bank Account Number:", bank_account);
    // console.log("IFSC Code:", ifsc);

    if (bank_account && ifsc) {
      // console.log("Doing bank verification");

      try {
        // console.log("Verifying bank details:", {
        //   bank_account,
        //   ifsc,
        //   name: updateData.name,
        // });
        const bankResponse = await got.post(
          `http://localhost:${PORT}/v1/bankValidation/verify-bank`,
          {
            json: {
              bank_account: bank_account,
              ifsc: ifsc,
              name: updateData.name,
              verification_id: "kyc-bank-verification-id",
            },
            responseType: "json",
          }
        );

        console.log("✅ Bank verification response:", bankResponse.body);

        if (bankResponse.body.account_status !== "VALID") {
          return res.status(400).json({
            success: false,
            message:
              "Bank verification failed. Please check your Bank details.",
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

    // console.log("Bank verification completed successfully");

    //extract ocr image from userdata
    const ocrImageUrl = updateData?.bankDetails[0].uploadCancelledCheque;
    // console.log("Uploaded canceled check : ", ocrImageUrl);

    if (ocrImageUrl) {
      try {
        const ocrResponse = await got.post(
          `http://localhost:${PORT}/v1/ocrValidation/verify-ocr`,
          {
            json: {
              file_url: ocrImageUrl,
            },
            responseType: "json",
          }
        );

        console.log("✅ OCR verification response:", ocrResponse.body);

        if (ocrResponse.body.status !== "VALID") {
          return res.status(400).json({
            success: false,
            message: "OCR verification failed. Please check your OCR details.",
            data: ocrResponse.body,
          });
        }
      } catch (apiError) {
        console.error(
          "❌ OCR verification API error:",
          apiError.response?.body || apiError.message
        );
        return res.status(500).json({
          success: false,
          message: "Failed to verify OCR with external API.",
        });
      }
    }
    try {
      // console.log("📝 Attempting to update user in database...");
      // console.log("User ID:", userId);
      // console.log("Update payload:", JSON.stringify(updateData, null, 2));

      // 🔁 Update user after validation
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).exec(); // Add .exec() to ensure promise resolution

      // console.log("MongoDB update result:", updatedUser ? "Success" : "Failed");
      if (updatedUser) {
        console.log("Updated user data:", JSON.stringify(updatedUser, null, 2));
      }

      if (!updatedUser) {
        // console.log("❌ User not found in database");
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      console.log("✅ User updated successfully");

      // 🔄 Refresh session to reflect latest user
      // console.log("Updating session with new user data...");
      req.login(updatedUser, (err) => {
        if (err) {
          console.error("❌ Session update failed:", err);
          return res
            .status(500)
            .json({ success: false, message: "Session update failed" });
        }

        // console.log("✅ Session updated successfully");
        // console.log("Sending success response to client...");

        try {
          const response = {
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
          };
          // console.log(
          //   "Sending response to client:",
          //   JSON.stringify(response, null, 2)
          // );
          return res.status(200).json(response);
        } catch (responseError) {
          console.error("Error sending response:", responseError);
          return res.status(500).json({
            success: false,
            message: "Error sending response",
            error: responseError.message,
          });
        }
      });
    } catch (dbError) {
      console.error("❌ Database operation failed:", dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to update user profile in database",
        error: dbError.message,
      });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
