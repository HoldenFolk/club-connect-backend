//David Holcer

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventID: { type: Number, required: true, unique: true }, // Unique identifier for the event
    clubID: { type: Number, ref: "Club", required: true }, // Reference to Clubs
    name: {type: String, required: true},
    date: { type: Date, required: true },
    place: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true,
    collection: "Events",
});

module.exports = mongoose.model("Event", eventSchema);
