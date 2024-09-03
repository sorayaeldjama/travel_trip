const SavedTrip = require('../models/savedTripModel');


exports.getAllSavedTrip = async (req, res) => {
    try {
        const response = await SavedTrip.find();
        res.status(200).json(response);
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createSavedTrip = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, journeyId, suggestionId } = req.body;
        const existingSavedTrip = await SavedTrip.findOne({ userId, journeyId, suggestionId });
        if (existingSavedTrip) {
            return res.status(400).json({ error: 'Saved trip with the same userId, journeyId, and suggestionId already exists' });
        }
        const savedTrip = new SavedTrip({ userId, journeyId, suggestionId });
        await savedTrip.save();

        res.status(201).json({ message: 'Trip created successfully!' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getSavedTripsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const savedTrips = await SavedTrip.find({ userId: userId }).populate('journeyId suggestionId');

        res.status(200).json(savedTrips);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSavedTripsByUserIdAndJourneyId = async (req, res) => {
    try {
        const {userId, journeyId} = req.params;

        const savedTrips = await SavedTrip.find({ userId: userId, journeyId: journeyId}).populate('suggestionId');
        res.status(200).json(savedTrips);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteSavedTrip = async (req, res) => {
    try {
        const { savedTripId } = req.params;

        await SavedTrip.findByIdAndDelete(savedTripId);

        res.status(200).json({ message: 'Saved Trip deleted successfully!' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
