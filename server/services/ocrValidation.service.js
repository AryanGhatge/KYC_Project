const got = require("got");
const {generateSignature} = require("../utils/generateSignature");

exports.validateOCRDetails= async ({ document_type, file_url, verification_id }) => {
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
      "x-api-version" : "2024-12-01"
    };

    const body = {
        document_type,
        file_url,
        verification_id
    }

    const response = await got
      .post(
        "https://sandbox.cashfree.com/verification/bharat-ocr",
        {
            headers: headers,
          json: body,
        }
      )
      .json();

      console.log(
      "OCR verification (sandbox) success:",
      JSON.stringify(response, null, 2)
    );

    return response;
  } catch (error) {
    console.error(
      "OCR validation error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
