const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        userID: {
            type: String,
            unique: true,
            required: [true, "User ID is required"],
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Email is invalid",
            ],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        email:{
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        profilePicture: {
            type: String,
            default: null, // Can be null if no profile picture is uploaded
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        publicKey: {
            type: String,
            unique: true, // Ensures each user has a unique public key
            required: [true, "Public key is required"],
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
        collection: "Users"
    }
);

const User = mongoose.models?.User || model("User", UserSchema);
module.exports = User;
