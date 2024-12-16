//David Holcer 
const mongoose = require("mongoose");

const clubsFollowedSchema = new mongoose.Schema(
    {
        userID: {
            type: Number,
            required: true
        },
        clubIDs: {
            type: [Number], // Correct way to define an array of Numbers
            ref: "Club"
        }
    },
    {
        timestamps: true,
        collection: "ClubsFollowed",
    }
);

module.exports = mongoose.model("ClubsFollowed", clubsFollowedSchema);