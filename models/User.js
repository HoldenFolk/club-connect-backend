//David Holcer
// Users(userID, email, username, password, publicKey)

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        userID: {
            type: Number,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^[a-zA-Z0-9._%+-]+@(mail\.mcgill\.ca|mcgill\.ca)$/,
                "Email must be a valid @mail.mcgill.ca or @mcgill.ca address",
            ],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
        collection: "Users",
    }
);

const User = mongoose.models?.User || model("User", UserSchema);
module.exports = User;
