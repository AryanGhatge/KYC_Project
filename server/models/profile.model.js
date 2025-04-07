const mongoose = require("mongoose");

// Enum for Gender
const GenderEnum = {
  MALE: "Male",
  FEMALE: "Female",
  OTHERS: "Others",
};

const profileDetailSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: "Gender must be 'Male', 'Female', or 'Others'",
    },
    required: [true, "Gender is required"],
  },
  placeOfBirth: {
    type: String,
    required: [true, "Place of Birth is required"],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 100;
      },
      message: "Place of Birth must be between 3 and 100 characters long",
    },
  },
  occupation: {
    type: String,
    required: [true, "Occupation is required"],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 50;
      },
      message: "Occupation must be between 3 and 50 characters long",
    },
  },
  annualIncome: {
    type: String,
    required: [true, "Annual income is required"],
    // min: [0, "Annual income cannot be negative"],
    // validate: {
    //   validator: Number.isInteger,
    //   message: "Annual Income must be a valid number",
    // },
  },
  citizenship: {
    type: Boolean,
    required: [true, "Citizenship status is required"],
  },
  informationConfirmation: {
    type: Boolean,
    required: [true, "Information Confirmation is required"],
  },
});

module.exports = mongoose.model("ProfileDetail", profileDetailSchema);
