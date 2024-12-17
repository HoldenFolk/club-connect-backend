//David Holcer
const mongoose = require("mongoose");

const clubsFollowedSchema = new mongoose.Schema(
    {
        userID: {
            type: Number,
            required: true
        },
        clubIDs: {
            type: [Number],
            ref: "Club"
        }
    },
    {
        timestamps: true,
        collection: "ClubsFollowed",
    }
);

module.exports = mongoose.model("ClubsFollowed", clubsFollowedSchema);