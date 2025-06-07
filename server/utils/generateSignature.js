const got = require("got");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Generate X-Cf-Signature (required even in sandbox now)
exports.generateSignature = (clientId, publicKeyPath) => {
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