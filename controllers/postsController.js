const Club = require("../models/Club");
const Post = require("../models/Post");
const User = require("../models/User");
const Moderator = require("../models/Moderator");

//Posts(userID, postId, clubId, title, text, imageURL, date) 

//user creates post for a club 
const createPost = async (req, res) => {
    
    
    var {userID, clubID, title, text, imageURL} = req.body;

    /*
    // Validate mandatory fields
    if (!userID || !clubID || !title || !text) {
        return res.status(400).json({ error: "Required fields missing" });
    }
    */
    
    try {

        /*
        //user and club exists check
        const club = await Club.findOne({ clubID });
        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        //check if poster is a moderator 
        const existingMod = await Moderator.findOne({ userID, clubID });
        if (!existingMod) {
            return res.status(400).json({ error: "This user is not a moderator for this club." });
        }
        */

        //for creating 
        userID = 1; 
        clubID = 10; 
        title = "Example Post 2."; 
        text = "Hi"; 

        //create new post 
        const postCount = await Post.countDocuments(); 
        const postID = postCount + 1;

        const date = new Date(); //post date will be date the request was processed 

        //add to Posts 
        const newPost = new Post({
            userID,
            postID, 
            clubID, 
            title, 
            text, 
            imageURL, 
            date
        });
        const savedPost = await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: savedPost });

    } 
    catch (error) {
        console.error("Error creating moderator:", error);
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
        
        //get n posts 
        const posts = await Post.find({ clubID: cID}, {limit: postCount}); 
        posts.sort('date'); //sort by date
        console.log(posts); 

        res.status(201).json({ posts });

    } catch (error) {
        console.error("Error getting club posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};  


//get all posts for a user (dashboard) 
const getDashboardPosts = async (req, res) => {
    //get all clubs followed 
    //for each one, get all posts 
}; 


module.exports = {createPost, getClubPosts, getDashboardPosts};