const express = require("express");
const { createClub, getClubById } = require("../controllers/clubController");
const authMiddleware = require("../middlewares/authenticate")

const router = express.Router();

// Route for creating a club (requires authentication)
// router.post("/create", authMiddleware, createClub);
router.post("/create", authMiddleware, createClub);
// router.get("/:clubID", getClubById);
router.post("/:clubID", authMiddleware, getClubById);

module.exports = router;
