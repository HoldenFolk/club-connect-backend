const bcrypt = require("bcryptjs");
const Users = require("../models/User");
const crypto = require("crypto");


// Register a new user
const registerUser = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a public key for the user
        const { publicKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });

        // Calculate the next userID
        const userCount = await Users.countDocuments(); // Counts all documents in the Users collection
        const userID = userCount + 1;

        // Create a new user
        const newUser = new Users({
            userID, // Incremental user ID
            email,
            username,
            password: hashedPassword,
            publicKey, // Save the public key
        });

        const savedUser = await newUser.save();
        console.log("User successfully added:", savedUser);

        res.status(201).json({
            message: "User registered successfully",
            publicKey,
            userID,
        });
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
            publicKey: user.publicKey,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { registerUser, getUserById };