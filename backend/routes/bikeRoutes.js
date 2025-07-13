// routes/bikeRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ POST: Upload new bike (Owner only)
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, specs, pricePerHour, pricePerDay, location, barangay } = req.body;
  const ownerId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "Image is required" });
  }

  try {
    await db.query(
      "INSERT INTO bikes (name, specs, pricePerHour, pricePerDay, location, barangay, image, owner_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        specs,
        pricePerHour,
        pricePerDay,
        location,
        barangay,
        `/uploads/${req.file.filename}`,
        ownerId,
        "Available",
      ]
    );

    res.json({ message: "Bike uploaded successfully" });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: "Failed to upload bike" });
  }
});

// ✅ GET: Bikes only for the logged-in owner
router.get("/my-bikes", authMiddleware, async (req, res) => {
  const owner_id = req.user.id;

  try {
    const [rows] = await db.query("SELECT * FROM bikes WHERE owner_id = ?", [owner_id]);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching owner's bikes:", error);
    res.status(500).json({ error: "Failed to retrieve your bikes" });
  }
});

// ✅ Public route (no auth) - used by customers
router.get("/public", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.email AS owner FROM bikes b
       JOIN users u ON b.owner_id = u.id
       WHERE b.status = 'Available'`
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching available bikes:", error);
    res.status(500).json({ error: "Failed to retrieve bikes" });
  }
});

module.exports = router;
