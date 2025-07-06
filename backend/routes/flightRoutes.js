const express = require('express');
const {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Bütün uçuşları al (Public)
// Yeni uçuş yarat (Private/Admin)
router.route('/')
    .get(getFlights)
    .post(protect, authorize('admin'), createFlight);

// Uçuşu ID-yə görə al (Public)
// Uçuşu yenilə (Private/Admin)
// Uçuşu sil (Private/Admin)
router.route('/:id')
    .get(getFlightById)
    .put(protect, authorize('admin'), updateFlight)
    .delete(protect, authorize('admin'), deleteFlight);

module.exports = router; 