const express = require('express');
const router = express.Router();
const journeyController = require('../src/controllers/journeyController');


// Routes :

// Create a new journey
router.post('/', journeyController.createJourney);

// Get all journeys
router.get('/', journeyController.getAllJourneys);

// Get a single journey by ID
router.get('/:journeyId', journeyController.getJourneyById);

// Update a journey by ID
router.put('/:journeyId', journeyController.updateJourney);

// Delete a journey by ID
router.delete('/:journeyId', journeyController.deleteJourney);

module.exports = router;
