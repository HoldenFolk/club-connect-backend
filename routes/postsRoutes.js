const express = require("express");
const { createPost, getClubPosts, getDashboardPosts, deletePost } = require("../controllers/postsController");
const authenticate = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new post (requires authentication)
// router.post("/", authenticate, createPost);
router.post("/create", createPost);

// Get x posts for a specific club, sorted by date -> implement dynamic number of posts 
// router.get("/:clubID", authenticate, getClubPosts);
router.get("/clubfeed/:clubName/:postCount", getClubPosts);


// Get all posts for a user dashboard, sorted by date
// router.get("/:clubID", authenticate, getDashboardPosts);
router.get("/dashboard/:userID/:postCount", getDashboardPosts);

//delete post
router.delete("/delete/:postID/:userID", deletePost);


module.exports = router;