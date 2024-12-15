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
            followers: 0, 
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

//edit club information 
//does not work : Error fetching club by ID: Cast to Number failed for value "edit" (type string) at path "clubID" for model "Clubs"
const editClub = async (req, res) => {
     
    const { clubID, name, description, category, banner, logo, website, email} = req.body;
    const userID = req.user.userID; // Assuming `req.user` is populated by an authentication middleware 
    
    try {
        //mod check
        const mod = await Moderator.findOne({userID : userID, clubID : clubID});  
        if (!mod) {
            return res.status(400).json({ error: "This user is not a moderator for this club." });
        } 
        //get club
        const club = await Club.findOne({clubID}); 
        if (!club) {
            return res.status(400).json({ error: "Club you are trying to update does not exist." });
        }

        //update only non-null input fields 
        if (name) {
            //check if not same as another club
            const sameName = await Club.findOne({name : name}); 
            if (sameName) {
                return res.status(400).json({error: "A club with the same name already exists."}); 
            }
            club.name = name; 
        }
        if (description) {
            club.description = description; 
        }
        if (category) {
            club.category = category; 
        }
        if (banner) { 
            club.banner = banner; 
        }
        if (logo) {
            club.logo = logo; 
        }
        if (website) {
            club.website = website; 
        }
        if (email) {
            club.email = email; 
        }

        console.log("Attributes updated."); 

        //save changes to DB 
        await club.save();
        
        console.log(club); 

        res.status(200).json({message: "Club updated successfully.", updatedClub: club}); 

    } catch (error) {
        res.status(500).json({ error: "Internal server error"});
    }

}; 

//input : substring 
const searchClub = async (req, res) => {
    const { regex } = req.params;  

    try {
        //match club name with substring, case insensitive
        const clubs = await Club.find({name : {$regex : regex, $options: 'i'}}, {clubID: 1, name: 1});  
        
        //if empty, return no such club message 
        if (!clubs || (clubs.length == 0)) {
            return res.status(200).json({message: "No such club. "});
        }

        res.status(200).json({clubs}); 

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}; 

//return all clubs, ordered by decreasing number of followers 
const getDirectory = async (req, res) => {
    try {
        let dir = await Club.find({}, {clubID: 1, name: 1, logo: 1}).sort({followers: -1}); 
        res.status(201).json({ dir }); 
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}; 

module.exports = { createClub, getClubById, getClubByName, searchClub, editClub, getDirectory };
