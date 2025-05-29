const pool = require('../config/db');

// @desc    Create a new reservation
// @route   POST /api/reservations
exports.createReservation = async (req, res) => {

  const { restaurant_id, reservation_date, reservation_time, people_count } = req.body;
  
  const user_id = req.user.id;

  if (!restaurant_id || !reservation_date || !reservation_time || !people_count) {
    return res.status(400).json({ message: 'Please provide all reservation details.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const sql = "INSERT INTO reservations (user_id, restaurant_id, reservation_date, reservation_time, people_count) VALUES (?, ?, ?, ?, ?)";
    const result = await conn.query(sql, [user_id, restaurant_id, reservation_date, reservation_time, people_count]);
    
    res.status(201).json({ message: "Reservation created successfully!", reservationId: result.insertId.toString() });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Server Error while creating reservation." });
  } finally {
    if (conn) conn.release();
  }
};

// @desc    Get logged in user's reservations
// @route   GET /api/reservations/myreservations
exports.getMyReservations = async (req, res) => {
  const user_id = req.user.id;

  let conn;
  try {
    conn = await pool.getConnection();
    // Χρησιμοποιούμε JOIN για να πάρουμε και το όνομα του εστιατορίου,
    // ώστε να είναι η πληροφορία πιο χρήσιμη για το frontend.
    const sql = `
        SELECT r.reservation_id, r.reservation_date, r.reservation_time, r.people_count, r.status, rest.name as restaurant_name
        FROM reservations r
        JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
        WHERE r.user_id = ?
        ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `;
    const myReservations = await conn.query(sql, [user_id]);
    res.json(myReservations);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Server Error while fetching reservations." });
  } finally {
    if (conn) conn.release();
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  const reservation_id = req.params.id; // Παίρνουμε το ID της κράτησης από το URL
  const user_id = req.user.id; // Παίρνουμε το ID του χρήστη από το token (μέσω του protect middleware)

  if (!reservation_id) {
    return res.status(400).json({ message: 'Reservation ID is required.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const sql = "DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?";
    const result = await conn.query(sql, [reservation_id, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found or user not authorized to delete.' });
    }

    res.json({ message: 'Reservation deleted successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error while deleting reservation." });
  } finally {
    if (conn) conn.release();
  }
};