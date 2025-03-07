const updated_user = require("../models/updated_user.model");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res) => {
  try {
    const { password, confirmedPassword, name, mobileNo } = req.body;
    const email = req.body.email;
        console.log(
          "User: ",
          email,
          password,
          confirmedPassword,
          name,
          mobileNo
        );

    // Check if user already exists
    const user = await updated_user.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }


    // Validate password and confirmedPassword
    if (password !== confirmedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (excluding confirmedPassword)
    const newUser = new updated_user({
      email,
      password: hashedPassword,
      name,
      mobileNo,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNo: newUser.mobileNo,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err); // Log actual error
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.login = (req, res) => {
  res.json({ message: "Login successful", user: req.user, success: true });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
};

exports.isLoggedIn = (req, res) => {
  
}
