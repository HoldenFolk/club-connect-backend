const express = require("express");
const cors = require("cors");
// const helmet = require("helmet");
const app = express();

const clubRoutes = require("./routes/clubRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); 
const eventRoutes = require("./routes/eventRoutes"); 
const modRoutes = require("./routes/modRoutes")
const clubsFollowedRoutes = require("./routes/clubsFollowedRoutes")

// Middleware
app.use(cors());
// app.use(helmet());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/moderator", modRoutes);
app.use("/api/followClub", clubsFollowedRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});

module.exports = app;