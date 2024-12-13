const Club = require("../models/Club");
const User = require("../models/User");

// Create a new club
const createClub = async (req, res) => {
    const { name, description, category, banner, logo, website, email } = req.body;
    // const userId = req.user.userID; // Assuming `req.user` is populated by an authentication middleware

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
            // moderators: [userId] || null, // Add the creator as the first moderator
            // createdBy: userId || null,
        });

        const savedClub = await newClub.save();
        res.status(201).json({ message: "Club created successfully", club: savedClub });
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

//by clubID 
//or set a deleted flag? 
const deleteClub = async (req, res) => {
    //check if user is mod 
    //delete from Club 
    //delete from Moderators 
    //delete from clubsFollowed? 
}

//input : substring 
const searchClub = async (req, res) => {
    const { regex } = req.params;  

    try {
        //match club name with substring, case insensitive
        const clubs = await Club.find({name : {$regex : regex, $options: 'i'}}, {clubID: 1, name: 1}); 
        console.log(clubs); 
        
        //if empty, return no such club message 
        if (!clubs || (clubs.length == 0)) {
            return res.status(200).json({message: "No such club. "});
        }

        res.status(200).json({clubs}); 

    } catch (error) {
        console.error("Error fetching club by ID:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

}; 

module.exports = {createClub,getClubById, searchClub};
