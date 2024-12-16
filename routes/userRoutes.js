const express = require("express");
const { registerUser, getUserById, updateUserById, deleteUser } = require("../controllers/userController");
const authenticate = require("../middlewares/authenticate"); 

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Get user by ID
router.get("/:userID", getUserById);

// Update user by ID
router.put("/:userID", updateUserById);

//Delete this user, should be authenticated  
router.delete("/delete", authenticate, deleteUser); 

module.exports = router;