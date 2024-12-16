//Mina Dobrijevic

const express = require("express");
const { createPost, getClubPosts, getDashboardPosts, deletePost } = require("../controllers/postsController");
const authenticate = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new post (requires authentication)
router.post("/create", authenticate, createPost);

// Get x posts for a specific club, sorted by date -> implement dynamic number of posts 
router.get("/clubfeed/:clubName/:postCount", getClubPosts);

// Get all posts for a user dashboard, sorted by date
router.get("/dashboard/:postCount", authenticate, getDashboardPosts);

//delete post
router.delete("/delete/:postID", authenticate, deletePost);


module.exports = router;