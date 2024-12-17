//David Holcer

const express = require("express");
const { createEvent, getEventsByClub, deleteEvent } = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new event (requires authentication)
router.post("/create", authMiddleware, createEvent);

// Get all events for a specific club
router.get("/:clubID", authMiddleware, getEventsByClub);

// Delete an event by its eventId
router.delete("/:eventId", authMiddleware, deleteEvent);

module.exports = router;
