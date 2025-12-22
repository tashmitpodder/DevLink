// models/Post.js
import mongoose from "mongoose";

// One post in the feed
const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // in this line basically the author is a variable which stores the object_id.. and ref:"user" mean where we can find the user from using this object idea.. think of it like you have an id.. and the room where you have to find using the id is the ref..
    content: { type: String, required: true, trim: true }, // text of the post
    tags: [{ type: String, trim: true }], // optional tags like: MERN, Hackathon
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who liked
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Post", postSchema); //we write export so that i can import this js file elsewhere.. for that i have to export this file
