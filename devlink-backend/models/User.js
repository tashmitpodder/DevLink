// models/User.js
// this file basically stores the user data
import mongoose from "mongoose"; // import mongoose to define schema

// Define the structure (schema) of a user in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name must be provided
      trim: true,     // removes extra spaces
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no two users can have the same email
      lowercase: true, // store emails in lowercase
    },
    password: {
      type: String,
      required: true, // password must be provided
      minlength: 6,   // at least 6 characters long
    },
    role: {
      type: String,
      enum: ["user", "admin"], // user can be normal user or admin
      default: "user",
    },
  },
  { timestamps: true } // auto-adds createdAt & updatedAt fields
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
