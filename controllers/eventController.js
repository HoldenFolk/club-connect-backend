const Event = require("../models/Event");
const Club = require("../models/Club");

// Create a new event
const createEvent = async (req, res) => {
    const {name, clubID, date, place, description } = req.body;

    // Validate mandatory fields
    if (!name || !clubID || !date || !place || !description) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Check if the club exists
        // const club = await Club.findById(clubID);
        const club = await Club.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }

        // Check if the event ID is unique
        // const existingEvent = await Event.findOne({ eventID });
        // if (existingEvent) {
            // return res.status(400).json({ error: "An event with this ID already exists." });
        // }
        const existingEvent = await Event.findOne({ name, clubID });
        if (existingEvent) {
            return res.status(400).json({ error: "An event with this name already exists for the specified club." });
        }

        const eventCount = await Event.countDocuments(); // Counts all documents in the Users collection
        const eventID = eventCount + 1;

        // Create the event
        const newEvent = new Event({
            eventID,
            clubID,
            name,
            date,
            place,
            description });
        const savedEvent = await newEvent.save();

        res.status(201).json({ message: "Event created successfully", event: savedEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all events for a club
const getEventsByClub = async (req, res) => {
    const { clubID } = req.params;

    try {
        // Check if the club exists
        const club = await Event.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }

        // Fetch events for the club
        const events = await Event.find({ clubID });
        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    const { eventID } = req.params; // Ensure eventID comes from the URL params

    try {
        // Convert eventID from string (URL) to number
        const numericEventID = parseInt(eventID, 10);

        // Check if the conversion was successful
        if (isNaN(numericEventID)) {
            return res.status(400).json({ error: "Invalid eventID format. It must be a number." });
        }

        // Find and delete the event
        const deletedEvent = await Event.findOneAndDelete({ eventID: numericEventID });

        if (!deletedEvent) {
            return res.status(404).json({ error: `Event with eventID ${numericEventID} not found.` });
        }

        res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createEvent, getEventsByClub, deleteEvent };