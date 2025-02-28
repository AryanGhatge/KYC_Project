const mongoose = require("mongoose");

// Enum for Depository
const DepositoryEnum = ["NSDL", "CDSL", "OTHERS"];
const GenderEnum = ["Male", "Female", "Others"];
const AccountTypeEnum = ["Saving", "Current"];
const IdentityTypeEnum = ["Individual", "Mutual"];

const userSchemaUpdated = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: "Invalid email format",
    },
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Mobile number must be exactly 10 digits",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },

  panDetails: {
    panNumber: {
      type: String,
      //required: [true, "PAN number is required"],
      validate: {
        validator: function (v) {
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: "Invalid PAN format. Expected format: AAAAA9999A",
      },
    },
    dateOfBirth: {
      type: Date,
      // required: [true, "Date of birth is required"],
      validate: {
        validator: function (v) {
          return v < new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    iAm: {
      type: String,
      //required: [true, "Identity type is required"],
      enum: IdentityTypeEnum,
    },
  },

  profileDetails: {
    gender: {
      type: String,
      //required: [true, "Gender is required"],
      enum: GenderEnum,
    },
    placeOfBirth: {
      type: String,
      //required: [true, "Place of Birth is required"],
      minlength: [3, "Place of Birth must be at least 3 characters"],
      maxlength: [100, "Place of Birth cannot exceed 100 characters"],
    },
    occupation: {
      type: String,
      //required: [true, "Occupation is required"],
      minlength: [3, "Occupation must be at least 3 characters"],
      maxlength: [50, "Occupation cannot exceed 50 characters"],
    },
    annualIncome: {
      type: Number,
      //required: [true, "Annual income is required"],
      min: [0, "Annual income cannot be negative"],
    },
    citizenship: {
      type: Boolean,
      //required: [true, "Citizenship status is required"],
    },
    informationConfirmation: {
      type: Boolean,
      //required: [true, "Information Confirmation is required"],
    },
  },

  addressDetails: {
    permanentAddress: {
      type: String,
      //required: [true, "Permanent address is required"],
      minlength: [10, "Permanent address must be at least 10 characters"],
      maxlength: [100, "Permanent address cannot exceed 100 characters"],
    },
    landmark: {
      type: String,
      maxlength: [50, "Landmark cannot exceed 50 characters"],
    },
    permanentCity: {
      type: String,
      //required: [true, "City is required"],
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [50, "City cannot exceed 50 characters"],
    },
    permanentPincode: {
      type: String,
      //required: [true, "Pincode is required"],
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v);
        },
        message: "Pincode must be exactly 6 digits",
      },
    },
    permanentState: {
      type: String,
      //required: [true, "State is required"],
      minlength: [2, "State must be at least 2 characters"],
      maxlength: [50, "State cannot exceed 50 characters"],
    },
    permanentCountry: {
      type: String,
      //required: [true, "Country is required"],
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [50, "Country cannot exceed 50 characters"],
    },
  },

  bankDetails: [
    {
      bankName: {
        type: String,
        //required: [true, "Bank name is required"],
        minlength: [3, "Bank name must be at least 3 characters"],
        maxlength: [50, "Bank name cannot exceed 50 characters"],
      },
      accountType: {
        type: String,
        //required: [true, "Account type is required"],
        enum: AccountTypeEnum,
      },
      bankAccountNumber: {
        type: String,
        //required: [true, "Bank account number is required"],
        validate: {
          validator: function (v) {
            return /^\d{9,18}$/.test(v);
          },
          message: "Bank account number must be between 9 and 18 digits",
        },
      },
      ifscCode: {
        type: String,
        //required: [true, "IFSC code is required"],
        validate: {
          validator: function (v) {
            return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
          },
          message: "Invalid IFSC code format",
        },
      },
      primary: {
        type: Boolean,
        //required: [true, "Primary flag is required"],
      },
    },
  ],

  dematDetails: [
    {
      depository: {
        type: String,
        //required: true,
        enum: DepositoryEnum,
      },
      dpID: {
        type: String,
        //required: true,
        minlength: [16, "DP ID must be exactly 16 characters"],
        maxlength: [16, "DP ID must be exactly 16 characters"],
      },
      clientID: {
        type: String,
        //required: true,
        minlength: [16, "Client ID must be exactly 16 characters"],
        maxlength: [16, "Client ID must be exactly 16 characters"],
      },
      primary: {
        type: Boolean,
        //required: true,
      },
      clientMasterCopy: {
        type: Buffer,
        validate: {
          validator: function (v) {
            return !v || v.length <= 5 * 1024 * 1024;
          },
          message: "File size must be less than 5 MB",
        },
      },
    },
  ],
});

module.exports = mongoose.model("User_Updated", userSchemaUpdated);
