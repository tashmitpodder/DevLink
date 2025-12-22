// routes/authRoutes.js
//what do you mean by routed exactly?
import express from "express";
import bcrypt from "bcryptjs";       // for hashing passwords
import jwt from "jsonwebtoken";      // for authentication
import User from "../models/User.js"; // User model

const router = express.Router();

// ----------------- REGISTER ROUTE -----------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, 
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- LOGIN ROUTE -----------------
router.post("/login", async (req, res) => { //understand this line
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email }, // payload
      process.env.JWT_SECRET,                                // secret key
      { expiresIn: "1h" }                                   // token expiry
    );

    // respond with token and user info (without password)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
