// ✅ server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const db = require("./database/db");
const bikeRoutes = require("./routes/bikeRoutes"); // 🔐 Auth protected
const bookingRoutes = require("./routes/bookingRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || "fallbackSecretKey123!";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: Using fallback JWT_SECRET. Set JWT_SECRET in your .env file!");
}

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Ensure uploads folder exists ======
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ✅ Serve image uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsDir)
);

// ====== Health Check ======
app.get("/", (req, res) => {
  res.send("🎉 API is running — Motor Rental Server is live!");
});

// ====== Auth: Register ======
app.post("/api/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (!["customer", "owner"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("❌ DB Register Error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

// ====== Auth: Login ======
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "6h" });

    res.json({
      id: user.id,
      token,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ DB Login Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ====== Routes ======
app.use("/api/users", userRoutes);
app.use("/api/bikes", authMiddleware, bikeRoutes); // 🔐 Token required
app.use("/api/bookings", authMiddleware, bookingRoutes);

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
