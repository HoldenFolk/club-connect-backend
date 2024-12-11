const express = require("express");
const { registerUser, getUserById } = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);
// router.post("/register", (req, res) => {
//     res.status(200).json({ message: "Route works!" });
// });

// Get user by ID
// router.get("/:userID", getUserById);

module.exports = router;