// routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// 📂 Multer file storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 🆕 Booking creation with file uploads (valid ID + selfie)
router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "validId", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  bookingController.createBookingWithUploads
);

// ✏️ Optional: booking creation without uploads
router.post("/", authMiddleware, bookingController.createBooking);

// 📦 Get bookings (only for bikes the owner owns)
router.get("/", authMiddleware, bookingController.getAllBookings);

// ✅ Update booking status (accept/decline)
router.patch("/:id", authMiddleware, bookingController.updateBookingStatus);

module.exports = router;
