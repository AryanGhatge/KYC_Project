const got = require("got");
const {generateSignature}  = require("../utils/generateSignature")


exports.verifyPanSandbox = async ({ pan, verification_id, name }) => {
  try {
    const clientId = process.env.CF_CLIENT_ID; // Sandbox client id
    const clientSecret = process.env.CF_CLIENT_SECRET; // Sandbox secret
    const publicKeyPath = process.env.CF_PUBLIC_KEY_PATH; // Path to public key PEM

    const signature = generateSignature(clientId, publicKeyPath);
    console.log("signature : " + signature);

    const body = {
      pan,
      verification_id,
      name,
    };

    const headers = {
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-cf-signature": signature, // <-- Must include signature
      "Content-Type": "application/json",
    };

    const response = await got
      .post("https://sandbox.cashfree.com/verification/pan/advance", {
        headers: headers,
        json: body,
      })
      .json();

    console.log(
      "PAN verification (sandbox) success:",
      JSON.stringify(response, null, 2)
    );

    return response;
  } catch (error) {
    console.error(
      "Error during PAN verification (sandbox):",
      error.response?.body || error.message
    );
    throw error;
  }
};
