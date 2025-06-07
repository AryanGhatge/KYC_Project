const got = require("got");
const {generateSignature} = require("../utils/generateSignature");

exports.validateBankDetails = async ({ bank_account, ifsc, name, verification_id }) => {
  try {
    
     const clientId = process.env.CF_CLIENT_ID; // Sandbox client id
    const clientSecret = process.env.CF_CLIENT_SECRET; // Sandbox secret
    const publicKeyPath = process.env.CF_PUBLIC_KEY_PATH; // Path to public key PEM

    const signature = generateSignature(clientId, publicKeyPath);

    const headers = {
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-cf-signature": signature, // <-- Must include signature
      "Content-Type": "application/json",
    };

    const body = {
      bank_account,
      ifsc,
      name,
      verification_id
    }

    const response = await got
      .get(
        "https://sandbox.cashfree.com/verification/bank-account/sync",
        {
            headers: headers,
          json: body,
        }
      )
      .json();

      console.log(
      "Bank verification (sandbox) success:",
      JSON.stringify(response, null, 2)
    );

    return response;
  } catch (error) {
    console.error(
      "Bank validation error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
