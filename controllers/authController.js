const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/User");
require("dotenv").config(); // Load environment variables

// Load the private key from .env
const privateKey = process.env.PRIVATE_KEY;

// Sign a JWT
const signToken = (payload) => {
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: "48h" });
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = signToken({ id: user._id, username: user.username });
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {loginUser} ;
