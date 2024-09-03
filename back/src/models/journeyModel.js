const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: {type: String, required: true},
    departure: {type: String, required: true},
    arrival: {type: String, required: true}
});

module.exports = mongoose.model("Journey",journeySchema);