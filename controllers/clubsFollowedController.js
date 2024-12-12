const ClubsFollowed = require("../models/ClubsFollowed");
const Club = require("../models/Club");
const User = require("../models/User");

// Create a new follow
const addClub = async (req, res) => {
    const userID = req.user.userID;
    const { clubID } = req.body;

    // Validate mandatory fields
    if (!clubID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Verify club exists
        const club = await Club.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }

        // Verify user exists
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Find or create ClubsFollowed document for the user
        let clubsFollowed = await ClubsFollowed.findOne({ userID });

        if (!clubsFollowed) {
            // Create new document if it doesn't exist
            clubsFollowed = new ClubsFollowed({
                userID,
                clubIDs: [clubID]
            });
        } else {
            // Check if already following this club
            if (clubsFollowed.clubIDs.includes(clubID)) {
                return res.status(400).json({ error: "Already following this club." });
            }

            // Add club to existing array
            clubsFollowed.clubIDs.push(clubID);
        }

        // Save the document
        const savedClubsFollowed = await clubsFollowed.save();

        res.status(201).json({
            message: "Club followed successfully",
            clubsFollowed: savedClubsFollowed
        });
    } catch (error) {
        console.error("Error following club:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const removeClub = async (req, res) => {
    const userID = req.user.userID;
    const { clubID } = req.body;

    // Validate mandatory fields
    if (!clubID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Verify club exists
        const club = await Club.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }

        // Verify user exists
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Find or create ClubsFollowed document for the user
        let clubsFollowed = await ClubsFollowed.findOne({ userID });

        if (!clubsFollowed) {
            return res.status(400).json({ error: "No clubs followed." });
        } else {
            // Check if already following this club
            if (clubsFollowed.clubIDs.includes(clubID)) {
                clubsFollowed.clubIDs.pop(clubID);
            }
            else{
                return res.status(400).json({ error: "Not following given club." });
            }
        }

        // Save the document
        const savedClubsFollowed = await clubsFollowed.save();

        res.status(201).json({
            message: "Club unfollowed successfully",
            clubsFollowed: savedClubsFollowed
        });
    } catch (error) {
        console.error("Error unfollowing club:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all followed clubs for a user
const getFollowedClubs = async (req, res) => {
    const userID = req.user.userID;

    try {
        const clubsFollowed = await ClubsFollowed.findOne({ userID });

        if (!clubsFollowed) {
            return res.status(200).json({
                message: "No clubs followed",
                clubIDs: []
            });
        }

        res.status(200).json({
            message: "Followed clubs retrieved",
            clubIDs: clubsFollowed.clubIDs
        });
    } catch (error) {
        console.error("Error retrieving followed clubs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addClub, getFollowedClubs, removeClub };