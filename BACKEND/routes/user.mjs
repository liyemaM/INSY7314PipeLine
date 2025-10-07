import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "YOUR_SECRET_KEY"; // move to .env in production

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many requests, try again later." }
});

// SIGNUP
router.post("/signup", limiter, async (req, res) => {
  try {
    const { username, fullName, idNumber, accountNumber, password } = req.body;
    if (!username || !fullName || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ error: "All fields required." });
    }

    const collection = db.collection("users");

    const existing = await collection.findOne({ $or: [{ username }, { accountNumber }] });
    if (existing) return res.status(400).json({ error: "Username or Account Number already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, fullName, idNumber, accountNumber, password: hashedPassword };
    const result = await collection.insertOne(newUser);

    res.status(201).json({ message: "User created successfully", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", limiter, async (req, res) => {
  try {
    const { username, accountNumber, password } = req.body;
    if (!username || !accountNumber || !password) return res.status(400).json({ error: "All fields required." });

    const collection = db.collection("users");
    const user = await collection.findOne({ username, accountNumber });
    if (!user) return res.status(404).json({ error: "User not found." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, accountNumber: user.accountNumber, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth middleware
export function checkAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied, token missing!" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

export default router;
