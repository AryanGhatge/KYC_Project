const got = require("got");
const {generateSignature} = require("../utils/generateSignature");
const axios = require("axios");
const FormData = require("form-data");

exports.validateOCRDetails= async ({ document_type, file_url, verification_id }) => {
  try {
    
    const clientId = process.env.CF_CLIENT_ID; // Sandbox client id
    const clientSecret = process.env.CF_CLIENT_SECRET; // Sandbox secret
    const publicKeyPath = process.env.CF_PUBLIC_KEY_PATH; // Path to public key PEM

    const signature = generateSignature(clientId, publicKeyPath);

   

    const imageRes = await axios.get(file_url, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(imageRes.data, "binary");

    // Step 2: Create form-data for Cashfree API
    const form = new FormData();
    form.append("document_type", document_type);
    form.append("verification_id", verification_id);
    form.append("file", imageBuffer, {
      filename: "document.jpg", // or .png etc. based on your image
      contentType: imageRes.headers["content-type"]
    });

     const headers = {
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-cf-signature": signature, // <-- Must include signature
      "Content-Type": "application/json",
      "x-api-version" : "2024-12-01",
      ...form.getHeaders(),
    };

    console.log(
        "Till here"
    )

    console.log(form)
    // Step 3: Post to Cashfree OCR API
    const response = await got
      .post(
        "https://sandbox.cashfree.com/verification/bharat-ocr",
        {
            headers: headers,
            body: form
        }
      )
      .json();

    console.log("Till here2")

     console.log(
      "OCR verification (sandbox) success:",
      JSON.stringify(response, null, 2)
    )


    /*const body = {
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
    );*/

    return response;
  } catch (error) {
    console.error(
      "OCR validation error:",
      error.response?.body || error.message
    );
    throw error;
  }
};
