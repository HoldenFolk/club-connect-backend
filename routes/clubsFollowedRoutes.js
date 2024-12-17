//David Holcer

const express = require("express");
const { addClub, removeClub, getFollowedClubs, isFollowing } = require("../controllers/clubsFollowedController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
router.post("/followClub", authMiddleware, addClub);

router.post("/unfollowClub", authMiddleware, removeClub);

router.get("/", authMiddleware, getFollowedClubs);

router.post("/isfollowing", authMiddleware, isFollowing)

module.exports = router;
