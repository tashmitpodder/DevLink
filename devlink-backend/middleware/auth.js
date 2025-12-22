// middleware/auth.js
//understand what is happening in this code

import jwt from "jsonwebtoken";

// Middleware to protect routes
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from request header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info (from token) to request object
    req.user = decoded;

    // Pass control to the next function (controller)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
