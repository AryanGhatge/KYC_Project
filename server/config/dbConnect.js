const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connection Success..");
    })
    .catch((err) => {
      console.log("Connection failed..");
      console.error(err);
      process.exit(1);
    });
};
