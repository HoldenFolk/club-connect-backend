const Club = require("../models/Club");
const User = require("../models/User");
const Moderator = require("../models/Moderator");

require("dotenv").config();

// Create a new club
const createClub = async (req, res) => {
    const { name, description, category, banner, logo, website, email, verified, followers } = req.body;
    const userID = req.user.userID; // Assuming `req.user` is populated by an authentication middleware

    console.log(userID)

    // Validate mandatory fields
    if (!name || !description || !category) {
        return res.status(400).json({ error: "Name, description, and category are required." });
    }

    try {
        // Check if a club with the same name already exists
        const existingClub = await Club.findOne({ name });
        if (existingClub) {
            return res.status(400).json({ error: "A club with this name already exists." });
        }

        const clubCount = await Club.countDocuments(); // Counts all documents in the Users collection
        const clubID = clubCount + 1;

        // Create the new club
        const newClub = new Club({
            clubID,
            name,
            description,
            category,
            banner: banner || null,
            logo: logo || null,
            website: website || null,
            email: email || null,
            verified: verified || false,
            // moderators: [userId] || null, // Add the creator as the first moderator
            // createdBy: userId || null,
        });

        // Add the current user as a moderator for this club
        const existingMod = await Moderator.findOne({ userID, clubID });
        if (!existingMod) {
            const newMod = new Moderator({ userID, clubID });
            await newMod.save();
        }
        

        const savedClub = await newClub.save();
        res.status(201).json({ message: "Club created successfully", club: savedClub, moderatorStatus: existingMod ? "Already a moderator" : "Added as moderator" });
    } catch (error) {
        console.error("Error creating club:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Get a user by their ID
const getClubById = async (req, res) => {
    const { clubID } = req.params;

    try {
        // Find the club by MongoDB ID (_id)
        const club = await Club.findOne({clubID});
        // const user = await Users.findOne({ userID });

        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        // Destructure fields from the club document
        const { name, description, category, banner, logo, website, email } = club;

        // Send the club data in the response
        res.status(200).json({
            clubID: club._id, // Respond with MongoDB ID
            name,
            description,
            category,
            banner,
            logo,
            website,
            email
        });
    } catch (error) {
        console.error("Error fetching club by ID:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a club by their name
const getClubByName = async (req, res) => {
    const { name } = req.params;
    console.log('Name:', name);

    try {
        // Find the club by name (case-insensitive)
        const club = await Club.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        // Destructure fields from the club document
        const { clubID, description, category, banner, logo, website, email } = club;

        res.status(200).json({
            clubID,
            name: club.name,
            description,
            category,
            banner,
            logo,
            website,
            email,
        });
    } catch (error) {
        console.error("Error fetching club by name:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createClub, getClubById, getClubByName };
