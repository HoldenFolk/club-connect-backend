//David Holcer
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
    followers: Number,
    verified: { type: Boolean, required: false},
    banner: String,
    logo: String,
    category: String,
    website: String,
    email: String
},
    {
        timestamps: true,
        collection: "Clubs",
    }
);

module.exports = mongoose.model("Clubs", clubSchema);
