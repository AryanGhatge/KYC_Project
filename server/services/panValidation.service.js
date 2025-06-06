const got = require("got");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate X-Cf-Signature (required even in sandbox now)
const generateSignature = (clientId, publicKeyPath) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const dataToEncrypt = `${clientId}.${timestamp}`;

  const publicKey = fs.readFileSync(path.resolve(publicKeyPath), "utf8");
  const formattedKey = publicKey
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\n/g, "");

  const buffer = Buffer.from(dataToEncrypt, "utf8");

  const encrypted = crypto.publicEncrypt(
    {
      key: `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer
  );

  return encrypted.toString("base64");
};

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
