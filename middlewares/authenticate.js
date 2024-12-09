const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config(); // Ensure dotenv is loaded

const authMiddleware = async (req, res, next) => {
    console.log("Auth Middleware: Starting...");

    // Check for token in headers
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing Token" });
    }

    try {
        // Load the JWT secret
        const secret = process.env.PRIVATE_KEY;
        console.log("JWT Secret Loaded:", secret ? "Yes" : "No");

        if (!secret) {
            throw new Error("JWT_SECRET is not set in environment variables");
        }

        // Verify the token
        console.log("Verifying token...");
        const decoded = jwt.verify(token, secret);
        console.log("Token Decoded:", decoded);

        // Find the user in the database
        console.log("Finding user in database with ID:", decoded.id);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        console.log("User Found:", user);

        // Attach user info to the request object
        req.user = { id: user._id, username: user.username };
        console.log("User attached to request:", req.user);

        next(); // Pass control to the next middleware/handler
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ error: `Invalid token: ${error.message}` });
    }
};

module.exports = authMiddleware;
