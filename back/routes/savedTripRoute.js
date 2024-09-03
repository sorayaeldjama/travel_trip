const express = require('express');
const router = express.Router();
const savedTripController = require('../src/controllers/savedTripController');

// get all saved trips
router.get('/', savedTripController.getAllSavedTrip);

// Create a new saved trip record
router.post('/', savedTripController.createSavedTrip);

// Get all saved trip records for a user
router.get('/:userId', savedTripController.getSavedTripsByUserId);

// Get all saved trip with same user and journey ID
router.get('/:userId/:journeyId', savedTripController.getSavedTripsByUserIdAndJourneyId);

// Delete a saved trip record
router.delete('/:savedTripId', savedTripController.deleteSavedTrip);

module.exports = router;
