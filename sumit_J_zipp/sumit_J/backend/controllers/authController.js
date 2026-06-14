import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hackon_secret_token_signature_string";

// 1. REGISTER AN ACCOUNT
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    
    // 1. Check if the email profile is already registered
    const preExistingUser = await User.findOne({ email });
    if (preExistingUser) {
      return res.status(400).json({ error: "Email profile is already registered in our system." });
    }

    // ⚡ THE CRITICAL SECURITY LOCK: Guard against rogue admin accounts
    const requestedRole = role || "user";
    if (requestedRole === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(403).json({ 
          error: "Administrative Registration Locked", 
          message: "A master platform admin node already exists in this ledger ecosystem. Secondary admin registration is strictly prohibited." 
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user with default parameters
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: requestedRole,
      avatar: "",
      location: "Jaipur, India",
      joinedDate: "2026-06"
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    
    return res.status(201).json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        greenCredits: user.greenCredits,
        avatar: user.avatar,
        location: user.location
      } 
    });
  } catch (error) {
    return res.status(500).json({ error: "Authentication system configuration exception.", message: error.message });
  }
}

// 2. LOGIN TO AN ACCOUNT
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid identification login credentials provided." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    
    // ⚡ FIX: Added avatar and location here too so they pull from MongoDB on login
    return res.status(200).json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        greenCredits: user.greenCredits,
        avatar: user.avatar,
        location: user.location
      } 
    });
  } catch (error) {
    return res.status(500).json({ error: "Login authentication boundary node error.", message: error.message });
  }
}

// 3. ⚡ NEW: PROFILE UPDATER ENDPOINT (Crucial for ProfilePortfolio.jsx edit button)
export async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    const { name, location, avatar } = req.body;

    // Direct update query execution inside MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, location, avatar },
      { new: true } // Returns the fresh updated user data object layout row
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User node registry not found." });
    }

    return res.status(200).json({ 
      success: true, 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        greenCredits: updatedUser.greenCredits,
        avatar: updatedUser.avatar,
        location: updatedUser.location
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Database profile modification crash.", message: error.message });
  }
}