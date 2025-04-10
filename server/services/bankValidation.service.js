const got = require("got");
import { getCashfreeToken } from "./cashfreeToken.service";

export const validateBankDetails = async (data) => {
  try {
    const token = await getCashfreeToken();

    const response = await got
      .post(
        "https://payout-api.cashfree.com/payout/v1.2/validation/bankDetails",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          json: data,
        }
      )
      .json();

    return response;
  } catch (error) {
    console.error(
      "Bank validation error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
