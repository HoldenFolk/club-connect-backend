//Mina Dobrijevic

const Club = require("../models/Club");
const Moderator = require("../models/Moderator");
const User = require("../models/User"); 

//createModerator, adds moderator to this club
const createModerator =  async (req, res) => {

    const {userID, clubID} = req.body; 

    // Validate mandatory fields
    if (!userID || !clubID) {
        return res.status(400).json({ error: "All fields are required." });
    }
    
    try {
        //user and club exists check
        const club = await Club.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        //(user, club) unique check
        const existingMod = await Moderator.findOne({ userID, clubID });
        if (existingMod) {
            return res.status(400).json({ error: "This user is already a moderator for this club." });
        }

        //add to Moderators 
        const newMod = new Moderator({userID,clubID});
        const savedMod = await newMod.save();

        res.status(201).json({ message: "Moderator created successfully", moderator: savedMod });

    } 
    catch (error) {
        console.error("Error creating moderator:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 

module.exports = { createModerator }; 