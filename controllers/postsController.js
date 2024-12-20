//Mina Dobrijevic

const Club = require("../models/Club");
const Post = require("../models/Post");
const User = require("../models/User");
const Moderator = require("../models/Moderator");
const ClubsFollowed = require("../models/ClubsFollowed");


// User creates post for a club
const createPost = async (req, res) => {
    const { clubName, title, text, imageURL } = req.body;
    const userID = req.user.userID;

    // Validate mandatory fields
    if (!userID || !clubName || !title || !text) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    try {
        // Check if the club exists using clubName
        const club = await Club.findOne({ name: clubName });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }
        const clubID = club.clubID;

        // Check if the user exists
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if the user is a moderator for the club
        const existingMod = await Moderator.findOne({ userID, clubID });
        if (!existingMod) {
            return res.status(400).json({ error: "This user is not a moderator for this club." });
        }

        // Determine the new postID
        const lastPost = await Post.find().sort({ _id: -1 }).limit(1);
        const postID = lastPost.length > 0 ? lastPost[0].postID + 1 : 1;

        const date = new Date(); // Set the current date as the post date

        // Create a new post
        const newPost = new Post({
            userID,
            postID,
            clubID,
            title,
            text,
            imageURL,
            date,
        });

        const savedPost = await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//get all posts for a club (club feed)
const getClubPosts = async (req, res) => {
   
    const { clubName, postCount } = req.params;
    
    // Validate mandatory fields
    if (!clubName || !postCount) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    try {
        //get club ID 
        const club = await Club.findOne({ name: clubName}); 
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        } 
        const cID = club.clubID;  
        
        //get n posts. sorted by date, most recent first 
        const posts = await Post.find({ clubID: cID}).limit(postCount).sort({date: -1}); 
        if (posts.length == 0) {
            return res.status(201).json({message: "No posts found for this club.", posts: {}}); 
        } 

        res.status(201).json({ message: "Found posts for this club", posts: posts });

    } catch (error) {
        console.error("Error getting club posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};  


//get all posts for a user (dashboard) 
const getDashboardPosts = async (req, res) => {

    //with authentication
    const { postCount } = req.params;
    const userID = req.user.userID; // Assuming `req.user` is populated by an authentication middleware
    
    // Validate mandatory fields
    if (!userID || !postCount) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    try {
        const usr = await User.findOne({userID}); 
        if (!usr) {
            return res.status(404).json({ error: "User not found." });
        }

        //get clubs followed by this user
        var clubsFollowed = await ClubsFollowed.findOne({userID}); 
        //user does not follow any club 
        if (!clubsFollowed) {
            return res.status(201).json({message: "User does not follow any clubs.", posts: {}}); 
        }
        clubsFollowed = clubsFollowed.clubIDs 

        if (clubsFollowed.length == 0) {
            return res.status(201).json({message: "User does not follow any clubs.", posts: {}}); 
        }
         
        //condition array 
        let conditions = [];  
        for (let club of clubsFollowed) { 
            let condition = {clubID : club};
            conditions.push(condition);  
        }

        //get posts from all clubs followed, sorted by date. limit to postCount 
        let posts = await Post.find({ $or: conditions}).sort({date: -1}).limit(postCount); 
        if (posts.length == 0) {
            return res.status(201).json({message: "No posts found.", posts: {}}); 
        } 

        //return posts for this usr dashboard 
        res.status(201).json({ message: "Posts for this dashboard.", posts: posts });

    } catch (error) {
        console.error("Error getting club posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 

//deleting a post (by post id) 
const deletePost = async (req, res) => {
     
    const { postID } = req.params; 
    const userID = req.user.userID;

    // Validate mandatoriy fields
    if (!userID || !postID) {
        return res.status(400).json({ error: "Required fields missing" });
    }
    
    try {
        //get club associated with this post 
        const p = await Post.findOne({postID: postID}); 
        if (!p) {
            return res.status(404).json({ error: "Post does not exist."});
        }
        let club = p.clubID;  

        //check if user is a moderator
        const mod = await Moderator.findOne({userID: userID, clubID: club}); 
        if (!mod) {
            return res.status(404).json({ error: "User is not a moderator." });
        }

        const deletedPost = await Post.findOneAndDelete({ postID: postID });
        if (!deletedPost) {
            return res.status(404).json({ error: "Post could not be deleted. " });
        }

        res.status(201).json({ message : "Post was sucessfully deleted. ", post: deletedPost});

    } catch (error) {
        console.error("Error getting club posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}; 

module.exports = {createPost, getClubPosts, getDashboardPosts, deletePost};