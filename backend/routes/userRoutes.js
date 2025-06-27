const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Optional authMiddleware here if needed
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, email, role FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
