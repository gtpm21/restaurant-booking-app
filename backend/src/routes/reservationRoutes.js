const express = require('express');
const router = express.Router();

const { createReservation, getMyReservations, deleteReservation  } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createReservation);

router.get('/myreservations', getMyReservations);

// router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;