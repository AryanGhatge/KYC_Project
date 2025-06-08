const FormData = require("form-data");
const got = require("got");
const { generateSignature } = require("../utils/generateSignature");
require("dotenv").config();

exports.checkLivelinessService = async (imageBuffer, verificationId) => {
  const form = new FormData();
  form.append("verification_id", verificationId);
  form.append("image", imageBuffer, {
    filename: "image.jpg",
    contentType: "image/jpeg",
  });
  form.append("strict_check", "true");

  const clientId = process.env.CF_CLIENT_ID;
  const clientSecret = process.env.CF_CLIENT_SECRET;
  const publicKeyPath = process.env.CF_PUBLIC_KEY_PATH;

  const signature = generateSignature(clientId, publicKeyPath);

  const response = await got.post(
    "https://sandbox.cashfree.com/verification/liveliness",
    {
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-cf-signature": signature,
        ...form.getHeaders(),
      },
      body: form,
      responseType: "json",
    }
  );

  return response.body;
};
