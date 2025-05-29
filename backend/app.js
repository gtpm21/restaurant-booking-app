const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./src/config/db'); 

const userRoutes = require('./src/routes/userRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Restaurant Booking API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});