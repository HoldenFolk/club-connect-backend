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
        // profilePicture: {
        //     type: String,
        //     default: null, // Can be null if no profile picture is uploaded
        // },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        // publicKey: {
        //     type: String,
        //     unique: true, // Ensures each user has a unique public key
        //     required: [true, "Public key is required"],
        // },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
        collection: "Users",
    }
);

const User = mongoose.models?.User || model("User", UserSchema);
module.exports = User;
