// Clubs(clubID, description, logo, banner, category, website, email)

const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    clubID: {
        type: Number,
        unique: true,
        required: true
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    banner: String,
    logo: String,
    category: String,
    website: String,
    email: String,
    moderators: [{ type: Number, ref: "User" }], // Array of user IDs
    members: [{ type: Number, ref: "User" }],   // Optional: List of members
    createdBy: { type: Number, ref: "User" }, // Creator
},
    {
        timestamps: true,
        collection: "Clubs",
    }
);

module.exports = mongoose.model("Clubs", clubSchema);
