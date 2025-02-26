const mongoose = require("mongoose");

// Enum for Depository
const DepositoryEnum = {
  NSDL: "NSDL",
  CDSL: "CDSL",
  OTHERS: "Others",
};

const dematSchema = new mongoose.Schema({
  depository: {
    type: String,
    enum: Object.values(DepositoryEnum),
    required: true,
  },
  dpID: {
    type: String,
    required: true,
    minlength: 16,
    maxlength: 16,
    validate: {
      validator: function (v) {
        return v.length === 16;
      },
      message: (props) => `DP ID must be exactly 16 characters long`,
    },
  },
  clientID: {
    type: String,
    required: true,
    minlength: 16,
    maxlength: 16,
    validate: {
      validator: function (v) {
        return v.length === 16;
      },
      message: (props) => `Client ID must be exactly 16 characters long`,
    },
  },
  primary: {
    type: Boolean,
    required: true,
  },
  clientMasterCopy: {
    type: Buffer,
    validate: {
      validator: function (v) {
        return !v || v.length <= 5 * 1024 * 1024;
      },
      message: (props) => `File size must be less than 5 MB`,
    },
  },
});

// Creating the model
module.exports = mongoose.model("Demat", dematSchema);
