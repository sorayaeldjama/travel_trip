const Suggestion = require('../models/suggestionModel');


exports.createSuggestion = async (req, res) => {
    try {
        const { idPlace, lon, lat, name, type } = req.body;

        const suggestion = new Suggestion({ idPlace, lon, lat, name, type });
        await suggestion.save();

        res.status(201).json(suggestion);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getAllSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSuggestionById = async (req, res) => {
    try {
        const { suggestionId } = req.params;
        const suggestion = await Suggestion.findById(suggestionId);
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        res.status(200).json(suggestion);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateSuggestion = async (req, res) => {
    try {
        const { suggestionId } = req.params;
        const { idPlace, lon, lat, name, type } = req.body;
        const updatedSuggestion = await Suggestion.findByIdAndUpdate(suggestionId, { idPlace, lon, lat, name, type }, { new: true });
        if (!updatedSuggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        res.status(200).json({ suggestion: updatedSuggestion });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteSuggestion = async (req, res) => {
    try {
        const { suggestionId } = req.params;
        const deletedSuggestion = await Suggestion.findByIdAndDelete(suggestionId);
        if (!deletedSuggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        res.status(200).json({ message: 'Suggestion deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
