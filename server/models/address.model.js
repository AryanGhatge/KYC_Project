const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  permanentAddress: {
    type: String,
    required: [true, "Permanent address is required"],
    validate: {
      validator: function (v) {
        return v.length >= 10 && v.length <= 100;
      },
      message: "Permanent address must be between 10 and 100 characters long",
    },
  },
  landmark: {
    type: String,
    validate: {
      validator: function (v) {
        return v == null || v.length <= 50;
      },
      message: "Landmark can't exceed 50 characters",
    },
  },
  permanentCity: {
    type: String,
    required: [true, "City is required"],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 50;
      },
      message: "City must be between 2 and 50 characters long",
    },
  },
  permanentPincode: {
    type: String,
    required: [true, "Pincode is required"],
    validate: {
      validator: function (v) {
        return /^\d{6}$/.test(v);
      },
      message: "Pincode must be exactly 6 digits",
    },
  },
  permanentState: {
    type: String,
    required: [true, "State is required"],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 50;
      },
      message: "State must be between 2 and 50 characters long",
    },
  },
  permanentCountry: {
    type: String,
    required: [true, "Country is required"],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 50;
      },
      message: "Country must be between 2 and 50 characters long",
    },
  },
});

module.exports = mongoose.model("Address", addressSchema);
