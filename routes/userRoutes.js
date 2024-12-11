const express = require("express");
const { registerUser, getUserById, updateUserById } = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Get user by ID
// router.get("/:userID", getUserById);

// Update user by ID
router.put("/:userID", updateUserById);

module.exports = router;