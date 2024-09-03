const express = require('express');
const router = express.Router();
const suggestionController = require('../src/controllers/suggestionController');

// Create a new suggestion
router.post('/', suggestionController.createSuggestion);

// Get all suggestions
router.get('/', suggestionController.getAllSuggestions);

// Get a single suggestion by ID
router.get('/:suggestionId', suggestionController.getSuggestionById);

// Update a suggestion by ID
router.put('/:suggestionId', suggestionController.updateSuggestion);

// Delete a suggestion by ID
router.delete('/:suggestionId', suggestionController.deleteSuggestion);

module.exports = router;
