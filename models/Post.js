//Posts(userID, postId, clubId, title, text, imageURL, date) 

const mongoose = require("mongoose"); 


const postSchema = new mongoose.Schema(
    {
        userID: {
            type: Number, 
            unique: false,
            required: true
        },
        clubID: {
            type: Number,
            unique: false,
            required: true
        },
        postID: {
            type: Number, 
            unique: true, 
            required: true
        }, 
        title: { 
            type: String, 
            required: true 
        },
        text: { 
            type: String, 
            required: true 
        },
        imageURL: String, //not required, one image per post
        date: {
            type: Date, 
            required: true
        },
    },
    {
        timestamps: true,
        collection: "Posts",
    }
);

module.exports = mongoose.model("Posts", postSchema);