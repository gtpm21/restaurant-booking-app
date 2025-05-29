const express = require('express');
const router = express.Router();

const { createReservation, getMyReservations } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// Pro Tip: Αντί να βάζουμε το 'protect' σε κάθε route ξεχωριστά,
// μπορούμε να πούμε στον router να το εφαρμόζει σε ΟΛΑ τα routes
// που θα οριστούν σε αυτό το αρχείο από εδώ και κάτω.
router.use(protect);

// Route για δημιουργία νέας κράτησης
router.post('/', createReservation);

// Route για την προβολή των κρατήσεων του συνδεδεμένου χρήστη
router.get('/myreservations', getMyReservations);

// Στο μέλλον, εδώ θα μπορούσαν να μπουν τα routes για update/delete
// router.put('/:id', updateReservation);
// router.delete('/:id', deleteReservation);

module.exports = router;