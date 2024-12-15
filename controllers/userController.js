const bcrypt = require("bcryptjs");
const Users = require("../models/User");
const ClubsFollowed = require("../models/ClubsFollowed");
const Clubs = require("../models/Club"); 
const crypto = require("crypto");
const Moderator = require("../models/Moderator");
const Posts = require("../models/Post");


// Register a new user
const registerUser = async (req, res) => {
    const { email, username, password } = req.body;  

    if (!email || !username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a public key for the user
        // const { publicKey } = crypto.generateKeyPairSync("rsa", {
        //     modulusLength: 2048,
        //     publicKeyEncoding: { type: "spki", format: "pem" },
        //     privateKeyEncoding: { type: "pkcs8", format: "pem" },
        // });

        // Calculate the next userID
        //const userCount = await Users.countDocuments(); // Counts all documents in the Users collection
        //const userID = userCount + 1;

        //find more effective way? 
        const userCount = await Users.find().sort({_id: -1}).limit(1);
        const userID = userCount[0].userID + 1;

        // Create a new user
        const newUser = new Users({
            userID, // Incremental user ID
            email,
            username,
            password: hashedPassword,
            // publicKey, // Save the public key
        });

        const savedUser = await newUser.save();
        console.log("User successfully added:", savedUser);

        res.status(201).json({
            message: "User registered successfully",
            // publicKey,
            userID,
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get a user by their ID
const getUserById = async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await Users.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.userID,
            email: user.email,
            username: user.username,
            publicKey: user.publicKey,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Update a user by their ID
const updateUserById = async (req, res) => {
    const { userID } = req.params;
    const { email, username, password } = req.body;

    try {
        // Find the user by userID
        const user = await Users.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the fields if provided
        if (email) {
            user.email = email;
        }

        if (username) {
            user.username = username;
        }

        if (password) {
            // Hash the new password before saving
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser.userID,
                email: updatedUser.email,
                username: updatedUser.username,
                publicKey: updatedUser.publicKey,
            },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//deleting a user 
const deleteUser = async (req, res) => {
    
    const userID = req.user.userID;  

    try {
        
        //delete from users
        const deletedUser = await Users.findOneAndDelete({userID : userID});  
        console.log(deletedUser); 

        //delete from clubs followed 
        const prevFollowed = await ClubsFollowed.findOneAndDelete({ userID: userID}); 
        console.log(prevFollowed); 

        //remove following from clubs 
        if (prevFollowed) {
            for (let clubID of prevFollowed.clubIDs) {
                let club = await Clubs.findOne({clubID: clubID}); 
                if (club) {
                    club.followers = club.followers -1;
                    console.log(club);  
                    await club.save();  
                }
            }
        }

        //delete from moderators 
        const deletedMod = await Moderator.deleteMany({userID: userID}); 
        console.log(deletedMod);

        //set userID = 0 on posts made by that user, like a deleted flag 
        //not deleting the post
        const posts = await Posts.find({userID: userID}); 
        if (posts.length > 0) {
            for (let post of posts) {
                post.userID = 0; 
                await post.save(); 
            }
        }

        res.status(200).json({message: "User deleted successfully.", user: deletedUser});  

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}

module.exports = { registerUser, getUserById, updateUserById, deleteUser };