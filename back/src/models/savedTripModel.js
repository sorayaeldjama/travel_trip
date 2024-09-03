const mongoose = require("mongoose");

const savedTripSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    journeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey', required: true },
    suggestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Suggestion', required: true }
});

module.exports = mongoose.model("SavedTrip", savedTripSchema);
