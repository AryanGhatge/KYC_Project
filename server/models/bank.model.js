const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, "Bank name is required"],
    validate: {
      validator: function (v) {
        return v.length >= 3 && v.length <= 50;
      },
      message: (props) =>
        `Bank name '${props.value}' must be between 3 and 50 characters long`,
    },
  },
  accountType: {
    type: String,
    enum: {
      values: ["Saving", "Current"],
      message: (props) =>
        `${props.value} is not a valid account type. Must be either 'Saving' or 'Current'`,
    },
    required: [true, "Account type is required"],
  },
  bankAccountNumber: {
    type: Number,
    required: [true, "Bank account number is required"],
    validate: {
      validator: function (v) {
        return /^\d{9,18}$/.test(v); // Assuming account numbers can be between 9 and 18 digits
      },
      message: (props) =>
        `Bank account number '${props.value}' must be between 9 and 18 digits`,
    },
  },
  ifscCode: {
    type: String,
    required: [true, "IFSC code is required"],
    validate: {
      validator: function (v) {
        return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v); // IFSC code format: 4 letters, '0', then 6 alphanumeric characters
      },
      message: (props) =>
        `IFSC code '${props.value}' is invalid. Expected format is 4 letters, followed by '0', and 6 alphanumeric characters`,
    },
  },
  primary: {
    type: Boolean,
    required: [true, "Primary flag is required"],
  },
});

module.exports = mongoose.model("Bank", bankSchema);
