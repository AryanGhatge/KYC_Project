const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model"); 
require("dotenv").config();

module.exports.createUser = async(req,res) => {
    try {
        const { email, password, confirmedPassword, name, mobileNo } = req.body;

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message:"User with email already exists",
                success: false
            })
        }

        if(password != confirmedPassword) {
            return res.status(400).json({
                success:false,
                message: "Password and confirm password does not match"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name, mobileNo });
        await newUser.save();

        res.status(201).json({
            success: true,
            message:"User Registered Successfully",
            newUser
        })
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
}

module.exports.login = async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token , user });
    } catch (err) {
        res.status(500).json({ error: "Error logging in" });
    }
}
