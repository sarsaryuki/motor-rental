// routes/bikeRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for file upload
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

// ✅ Middleware for all routes
router.use(authMiddleware);

// ✅ POST a new bike (owner only)
router.post("/upload", upload.single("image"), async (req, res) => {
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

// ✅ GET all available bikes only (for customer dashboard)
router.get("/", async (req, res) => {
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
