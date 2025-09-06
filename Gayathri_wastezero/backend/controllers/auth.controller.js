const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const { generateToken } = require("../utils/auth.util");
const loginUser = async (req, res) => {
    const { email, password ,rememberMe} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required", success: false });
    }
    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }
        const token = generateToken(user,rememberMe);
        const { password: userPassword, ...rest } = user._doc;
        res.status(200).json({ token, user: rest, message: "Login successful", success: true });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

module.exports = { loginUser };