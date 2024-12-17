//Mina Dobrijevic

//Moderators(userId, clubId), pair is unique, single attributes can be repeated

const mongoose = require("mongoose");

const moderatorSchema = new mongoose.Schema(
    {
        userID: {
            type: Number,
            required: true
        },
        clubID: {
            type: Number, 
            required: true
        },
    }, 

    {
    timestamps: true,
    collection: "Moderators",
    }
);

module.exports = mongoose.model("Moderator", moderatorSchema);