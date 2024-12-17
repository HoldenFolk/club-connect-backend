//Mina Dobrijevic

const express = require("express");
const { createModerator} = require("../controllers/moderatorController");
const authMiddleware = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new moderator (requires authentication)
router.post("/create", authMiddleware, createModerator);

module.exports = router;