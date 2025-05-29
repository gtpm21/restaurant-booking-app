const pool = require('../config/db');

// @desc    Get all restaurants
// @route   GET /api/restaurants
exports.getRestaurants = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const restaurants = await conn.query("SELECT restaurant_id, name, location, description, image_url FROM restaurants");
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  } finally {
    if (conn) conn.release();
  }
};