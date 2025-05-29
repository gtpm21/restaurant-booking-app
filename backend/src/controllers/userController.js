const pool = require('../config/db'); 
const bcrypt = require('bcryptjs');   
const jwt = require('jsonwebtoken');  

// --- ΣΥΝΑΡΤΗΣΗ ΓΙΑ ΕΓΓΡΑΦΗ ΧΡΗΣΤΗ (REGISTER) ---
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const existingUser = await conn.query("SELECT email FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await conn.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  } finally {
    if (conn) conn.release();
  }
};


// --- ΣΥΝΑΡΤΗΣΗ ΓΙΑ ΣΥΝΔΕΣΗ ΧΡΗΣΤΗ (LOGIN) ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    const users = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Στέλνουμε γενικό μήνυμα για ασφάλεια
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '24h' } 
    );

    res.json({
      message: 'Logged in successfully!',
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  } finally {
    if (conn) conn.release();
  }
};
