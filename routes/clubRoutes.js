const express = require("express");
const { createClub, getClubById, getClubByName, searchClub, editClub, getDirectory } = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
router.post("/create", authMiddleware, createClub);

// Route for getting club by ID
router.get("/:clubID", getClubById);

//Route for getting club by name
router.get("/name/:name", getClubByName);

//not private 
router.get("/search/:regex", searchClub);

// Route for editing club info (requires authentication)
router.post("/edit", authMiddleware,  editClub); 

//not private
router.get("/dir", getDirectory); 

module.exports = router;
