const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  panDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PanInfo",
  },
  ProfileDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfileDetail",
  },
  addressDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  bankDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
  ],
  dematDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demat",
    },
  ],
  //   image: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Image",
  //   },
});

module.exports = mongoose.model("User", userSchema);
