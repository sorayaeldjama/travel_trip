const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idPlace: {type: String, required: true},
    lon: {type: String, required: true},
    lat: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true}
});

module.exports = mongoose.model("Suggestion",suggestionSchema);