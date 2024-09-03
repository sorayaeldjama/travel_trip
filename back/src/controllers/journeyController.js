const Journey = require('../models/journeyModel');


exports.createJourney = async (req, res) => {
    try {
        const { title, departure, arrival } = req.body;
        const journey = new Journey({ title, departure, arrival });
        await journey.save();
        res.status(201).json( journey );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllJourneys = async (req, res) => {
    try {
        const journeys = await Journey.find();
        res.status(200).json(journeys);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getJourneyById = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const journey = await Journey.findById(journeyId);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.status(200).json(journey);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const { title, departure, arrival } = req.body;
        const updatedJourney = await Journey.findByIdAndUpdate(journeyId, { title, departure, arrival }, { new: true });
        if (!updatedJourney) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.status(200).json({ journey: updatedJourney });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const deletedJourney = await Journey.findByIdAndDelete(journeyId);
        if (!deletedJourney) {
            return res.status(404).json({ message: 'Journey not found' });
        }
        res.status(200).json({ message: 'Journey deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
