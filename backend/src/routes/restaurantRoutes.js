const express = require('express');
const router = express.Router();

const { getRestaurants } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRestaurants);

module.exports = router;