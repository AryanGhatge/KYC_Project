const got = require("got");

exports.getCashfreeToken = async () => {
  try {
    const response = await got
      .post("https://payout-api.cashfree.com/payout/v1/authorize", {
        headers: {
          "Content-Type": "application/json",
        },
        json: {
          client_id: process.env.CF_CLIENT_ID,
          client_secret: process.env.CF_CLIENT_SECRET,
        },
      })
      .json();

    return response.data.token;
  } catch (error) {
    console.error(
      "Error getting Cashfree token:",
      error.response?.body || error.message
    );
    throw error;
  }
};
