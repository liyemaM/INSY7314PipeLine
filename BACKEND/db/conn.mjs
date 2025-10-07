// db/conn.mjs
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "mongodb://127.0.0.1:27017";
console.log("MongoDB URI:", connectionString);

const client = new MongoClient(connectionString);
const dbName = "BankingINSY7314"; // change this to your DB name
let db;

try {
  await client.connect();
  db = client.db(dbName);
  console.log("MongoDB is CONNECTED to database:", dbName);
} catch (err) {
  console.error("MongoDB connection failed:", err);
}

// Export a helper to get collections safely
export default {
  collection: (name) => {
    if (!db) throw new Error("Database not initialized!");
    return db.collection(name);
  },
};
