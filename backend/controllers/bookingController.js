// backend/controllers/bookingController.js

const db = require("../database/db");



// ✅ Create a new booking (with or without files handled via routes)
exports.createBooking = async (req, res) => {
  try {
    const {
      bikeId,
      pickupDate,
      returnDate,
      type,
      totalPrice,
    } = req.body;
    const userId = req.user.id;

    if (!bikeId || !pickupDate || !returnDate || !type || !totalPrice) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const [result] = await db.query(
      `INSERT INTO bookings (bikeId, userId, pickupDate, returnDate, type, totalPrice, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [bikeId, userId, pickupDate, returnDate, type, totalPrice]
    );

    res.status(201).json({ id: result.insertId, message: "Booking created successfully" });
  } catch (err) {
    console.error("❌ Booking Creation Error:", err);
    res.status(500).json({ error: "Failed to create booking", details: err.message });
  }
};

// ✅ Create booking with uploads (valid ID + selfie)
exports.createBookingWithUploads = async (req, res) => {
  try {
    const {
      bikeId,
      pickupDate,
      returnDate,
      type,
      totalPrice,
    } = req.body;
    const userId = req.user.id;

    const validId = req.files?.validId?.[0]?.filename;
    const selfie = req.files?.selfie?.[0]?.filename;

    if (!bikeId || !pickupDate || !returnDate || !type || !totalPrice) {
      return res.status(400).json({ error: "Missing booking fields" });
    }

    const [result] = await db.query(
      `INSERT INTO bookings (bikeId, userId, pickupDate, returnDate, type, totalPrice, status, validId, selfie)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
      [bikeId, userId, pickupDate, returnDate, type, totalPrice, validId, selfie]
    );

    res.status(201).json({ id: result.insertId, message: "Booking with uploads created successfully" });
  } catch (err) {
    console.error("❌ Booking Upload Error:", err);
    res.status(500).json({ error: "Failed to create booking with uploads", details: err.message });
  }
};

// ✅ Get bookings for the current user's owned bikes
exports.getAllBookings = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [rows] = await db.query(`
      SELECT 
        bookings.id, bookings.type, bookings.pickupDate, bookings.returnDate,
        bookings.totalPrice, bookings.status, bookings.paymentStatus,
        bookings.validId, bookings.selfie,
        users.email AS user,
        bikes.name AS bikeName,
        bikes.location
      FROM bookings
      LEFT JOIN users ON bookings.userId = users.id
      LEFT JOIN bikes ON bookings.bikeId = bikes.id
      WHERE bikes.owner_id = ?
      ORDER BY bookings.id DESC
    `, [owner_id]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};



// ✅ Update booking status (Accepted, Declined, etc.)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const owner_id = req.user.id;

    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    const [result] = await db.query(
      `UPDATE bookings
       JOIN bikes ON bookings.bikeId = bikes.id
       SET bookings.status = ?
       WHERE bookings.id = ? AND bikes.owner_id = ?`,
      [status, id, owner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found or not authorized" });
    }

    res.status(200).json({ message: "Booking status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating booking status:", err);
    res.status(500).json({ error: "Failed to update status", details: err.message });
  }
};
