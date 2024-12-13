const express = require("express");
const { createPost, getClubPosts, getDashboardPosts, deletePost } = require("../controllers/postController");
const authenticate = require("../middlewares/authenticate"); // Middleware to ensure user is logged in

const router = express.Router();

// Create a new post (requires authentication)
// router.post("/", authenticate, createPost);
router.post("/create", createPost);

// Get all posts for a specific club, sorted by date 
// router.get("/:clubID", authenticate, getClubPosts);
router.get("/:clubID", getClubPosts);

// Get all posts for a user dashboard, sorted by date
// router.get("/:clubID", authenticate, getDashboardPosts);

router.get("/:clubID/:userID", getDashboardPosts);

 


module.exports = router;