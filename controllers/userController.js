const bcrypt = require("bcryptjs");
const Users = require("../models/User");

// Register a new user
const registerUser = async (req, res) => {
    const { email, username, password, profilePicture, publicKey } = req.body;

    if (!email || !username || !password || !publicKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            userID: `${username}-${Date.now()}`,
            email,
            username,
            profilePicture: profilePicture || null,
            password: hashedPassword,
            publicKey,
        });

        const savedUser = await newUser.save();
        console.log("User successfully added:", savedUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a user by their ID
const getUserById = async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await Users.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.userID,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            publicKey: user.publicKey,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { registerUser, getUserById };