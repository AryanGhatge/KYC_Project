const got = require("got");
const { getCashfreeToken } = require("./cashfreeToken.service.js");

exports.validatePanDetails = async (data) => {
  try {
    const token = await getCashfreeToken();

    const response = await got
      .post("https://payout-api.cashfree.com/payout/v1.2/validation/pan", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        json: data,
      })
      .json();

    return response;
  } catch (error) {
    console.error(
      "PAN validation error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
