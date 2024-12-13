const express = require("express");
const { createClub, getClubById, getClubByName, searchClub, editClub } = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
router.post("/create", authMiddleware, createClub);

// Route for getting club by ID
router.post("/:clubID", authMiddleware, getClubById);

//Route for getting club by name
router.get("/name/:name", getClubByName);

//not private 
router.get("/search/:regex", searchClub);

// Route for editing club info (requires authentication)
//router.post("/edit", authMiddleware, editClub);
router.get("/edit", editClub); 

module.exports = router;
