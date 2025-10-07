// server.mjs
import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ✅ Enable CORS (before routes)
app.use(cors({
  origin: true, // reflect the request origin automatically
  credentials: true
}));

app.use(express.json());

// ✅ Example API route
app.get("/", (req, res) => {
  res.send("Hello from HTTPS server 🚀");
});

// ✅ Load SSL certificates
const key = fs.readFileSync("./certs/key.pem");
const cert = fs.readFileSync("./certs/cert.pem");

// ✅ Create HTTPS server
const httpsServer = https.createServer({ key, cert }, app);

// ✅ Create HTTP → HTTPS redirect
const httpApp = express();
httpApp.get("*", (req, res) => {
  res.redirect("https://" + req.headers.host + req.url);
});

// ✅ Ports
const HTTPS_PORT = process.env.HTTPS_PORT || 4433; // use 4433 for local
const HTTP_PORT = process.env.HTTP_PORT || 8080;   // use 8080 for local

// ✅ Start HTTPS server
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`✅ HTTPS Server running on https://localhost:${HTTPS_PORT}`);
});

// ✅ Start HTTP redirect server
http.createServer(httpApp).listen(HTTP_PORT, () => {
  console.log(`🔁 HTTP redirect server running on http://localhost:${HTTP_PORT}`);
});

// In-memory "database" (temporary)
let users = [];

// ✅ Register route
app.post("/user/signup", (req, res) => {
  const { username, fullName, idNumber, accountNumber, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // For now we just push to array (later: use MongoDB)
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ username, fullName, idNumber, accountNumber, password });

  console.log("Registered users:", users);
  res.json({ message: "User registered successfully!" });
});

// ✅ Login route
app.post("/user/login", (req, res) => {
  const { username, accountNumber, password } = req.body;

  const user = users.find(
    u => u.username === username && u.accountNumber === accountNumber && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // For now just send success (later: use JWT)
  res.json({ token: "fake-jwt-token", message: "Login successful!" });
});