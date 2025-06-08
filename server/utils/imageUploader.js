const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (
  fileBuffer,
  folder,
  height,
  quality
) => {
  const options = { folder };
  if (height) options.height = height;
  if (quality) options.quality = quality;
  options.resource_type = "auto";

  // Convert buffer to base64 data URI
  const base64String = fileBuffer.toString("base64");
  // Detect mime type (you can pass it from caller if you want)
  const dataUri = `data:image/jpeg;base64,${base64String}`;

  console.log("Uploading to Cloudinary with options:", options);

  return await cloudinary.uploader.upload(dataUri, options);
};
