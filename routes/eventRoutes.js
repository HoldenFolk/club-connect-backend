const express = require("express");
const { createEvent, getEventsByClub, deleteEvent } = require("../controllers/eventController");
const authenticate = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new event (requires authentication)
// router.post("/", authenticate, createEvent);
router.post("/create", createEvent);

// Get all events for a specific club
// router.get("/:clubID", authenticate, getEventsByClub);
router.get("/:clubID", getEventsByClub);

// Delete an event by its eventId
// router.delete("/:eventId", authenticate, deleteEvent);
router.delete("/:eventID", deleteEvent);

module.exports = router;
