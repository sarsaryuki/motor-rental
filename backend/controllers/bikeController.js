const db = require("../database/db");

exports.getBikes = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [rows] = await db.query("SELECT * FROM bikes WHERE owner_id = ?", [owner_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Get Bikes Error:", err.message);
    res.status(500).json({ message: "Error fetching bikes" });
  }
};

exports.addBike = async (req, res) => {
  try {
    const {
      name,
      specs,
      pricePerDay,
      pricePerHour,
      location,
      barangay,
      status,
      availableTime,
    } = req.body;

    const owner_id = req.user.id;
    const owner = req.user.email;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO bikes 
        (name, specs, pricePerDay, pricePerHour, location, barangay, status, availableTime, image, owner, owner_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        specs,
        pricePerDay,
        pricePerHour,
        location,
        barangay,
        status || "Available", // Fallback to 'Available' if missing
        availableTime,
        image,
        owner,
        owner_id,
      ]
    );

    res.status(201).json({
      message: "Bike added successfully.",
      id: result.insertId,
      name,
      specs,
      pricePerDay,
      pricePerHour,
      location,
      barangay,
      status,
      availableTime,
      image,
      owner,
      owner_id,
    });

    console.log(`✅ Bike added by owner ID ${owner_id}: ${name}`);
  } catch (err) {
    console.error("❌ Add Bike Error:", err.message);
    res.status(500).json({ message: "Error adding bike" });
  }
};

exports.updateBike = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, specs, pricePerDay, pricePerHour,
      location, barangay, status, availableTime
    } = req.body;

    const owner_id = req.user.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let sql = `UPDATE bikes SET name = ?, specs = ?, pricePerDay = ?, pricePerHour = ?, location = ?, barangay = ?, status = ?, availableTime = ?`;
    const fields = [name, specs, pricePerDay, pricePerHour, location, barangay, status, availableTime];

    if (image) {
      sql += `, image = ?`;
      fields.push(image);
    }

    sql += ` WHERE id = ? AND owner_id = ?`;
    fields.push(id, owner_id);

    const [result] = await db.query(sql, fields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bike not found or not authorized" });
    }

    res.status(200).json({ id, name, specs, pricePerDay, pricePerHour, location, barangay, status, availableTime, owner_id, image });
  } catch (err) {
    console.error("❌ Update Bike Error:", err.message);
    res.status(500).json({ error: "Failed to update bike", details: err.message });
  }
};

exports.deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.id;

    const [result] = await db.query("DELETE FROM bikes WHERE id = ? AND owner_id = ?", [id, owner_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Bike not found or not authorized" });
    }

    res.status(200).json({ message: "Bike deleted" });
  } catch (err) {
    console.error("❌ Delete Bike Error:", err.message);
    res.status(500).json({ error: "Failed to delete bike" });
  }
};

// ✅ Public route for customer dashboard
exports.getAllAvailableBikes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bikes WHERE status = 'Available'");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching public bikes:", err.message);
    res.status(500).json({ message: "Failed to fetch bikes" });
  }
};
