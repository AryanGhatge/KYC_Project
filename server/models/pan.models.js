const mongoose = require("mongoose");

const panSchema = new mongoose.Schema({
  panNumber: {
    type: String,
    required: [true, "PAN number is required"],
    validate: {
      validator: function (v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: "Invalid PAN format. Expected format: AAAAA9999A",
    },
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Mobile number must be exactly 10 digits long",
    },
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function (v) {
        return v < new Date();
      },
      message: "Date of birth cannot be in the future",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: "Invalid email format",
    },
  },
  iAm: {
    type: String,
    required: [true, "Identity type is required"],
    enum: ["Individual", "Mutual"],
  },
});

module.exports = mongoose.model("PanInfo", panSchema);
