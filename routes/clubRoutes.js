const express = require("express");
const { createClub, getClubById, searchClub } = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
// router.post("/create", authMiddleware, createClub);
router.post("/create", createClub);
router.get("/:clubID", getClubById);

//not private 
router.get("/search/:regex", searchClub);

module.exports = router;
