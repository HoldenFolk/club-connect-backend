const express = require("express");
const { addClub, removeClub, getFollowedClubs } = require("../controllers/clubsFollowedController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
// router.post("/create", authMiddleware, createClub);
// router.post("/addClub", addClub);
router.post("/followClub", authMiddleware, addClub);

router.post("/unfollowClub", authMiddleware, removeClub);

// router.get("/:userID", getClubsByUserId);
router.get("/", authMiddleware, getFollowedClubs);

module.exports = router;
