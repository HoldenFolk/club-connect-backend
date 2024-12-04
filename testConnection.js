const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI || "your-mongo-uri-here";

const testConnection = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    } finally {
        mongoose.connection.close(); // Close the connection after testing
    }
};

testConnection();
