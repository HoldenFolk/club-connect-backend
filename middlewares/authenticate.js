const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware: Starting...");

    // Check for token in headers
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader)

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing Token" });
    }

    try {
        // Load the server private key
        const serverPrivateKey = process.env.PRIVATE_KEY;
        console.log("Server Private Key Loaded:", serverPrivateKey ? "Yes" : "No");

        if (!serverPrivateKey) {
            throw new Error("PRIVATE_KEY is not set in environment variables");
        }

        // Verify the token with server private key
        console.log("Verifying token...");
        console.log('Token: ', token);
        const decoded = jwt.verify(token, serverPrivateKey);
        console.log("Token Decoded:", decoded);

        // Find the user in the database
        console.log("Finding user in database with ID:", decoded.id);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        // Additional verification using user's public key
        // if (decoded.publicKey && decoded.publicKey !== user.publicKey) {
        //     console.log("Public Key Mismatch");
        //     return res.status(401).json({ error: "Unauthorized: Public key verification failed" });
        // }

        console.log("User Found:", user);

        // Attach user info to the request object
        req.user = {
            userID: user.userID,
            username: user.username,
        };
        console.log("User attached to request:", req.user);

        next(); // Pass control to the next middleware/handler
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ error: `Invalid token: ${error.message}` });
    }
};

module.exports = authMiddleware;