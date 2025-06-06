require("dotenv").config();
const got = require("got");

exports.getCashfreeToken = async () => {
  try {
    const response = await got
      .post("https://payout-gamma.cashfree.com/payout/v1/authorize", {
        headers: {
          "Content-Type": "application/json",
        },
        json: {
          clientId: process.env.CF_CLIENT_ID,
          clientSecret: process.env.CF_CLIENT_SECRET,
        },
      })
      .json();
    console.log("Client ID:", process.env.CF_CLIENT_ID);
    console.log("Client Secret:", process.env.CF_CLIENT_SECRET);

    console.log("Cashfree Token Response:", response); // ✅ Debug line

    if (response.status !== "SUCCESS" || !response.data?.token) {
      throw new Error("Token not received from Cashfree.");
    }

    return response.data.token;
  } catch (error) {
    console.error(
      "Error getting Cashfree token:",
      error.response?.body || error.message
    );
    throw error;
  }
};
