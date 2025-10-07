import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { checkAuth } from "./user.mjs";

const router = express.Router();

// GET all payments
router.get("/", checkAuth, async (req, res) => {
  try {
    const collection = db.collection("payments");
    const payments = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new payment
router.post("/upload", checkAuth, async (req, res) => {
  try {
    const { name, bankName, accountNumber, swiftCode, bankLocation, amount, paymentReference } = req.body;

    if (!name || !bankName || !accountNumber || !swiftCode || !bankLocation || !amount || !paymentReference) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newPayment = { name, bankName, accountNumber, swiftCode, bankLocation, amount, paymentReference, createdAt: new Date() };
    const collection = db.collection("payments");
    const result = await collection.insertOne(newPayment);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a payment by id
router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const collection = db.collection("payments");
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Payment not found" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
