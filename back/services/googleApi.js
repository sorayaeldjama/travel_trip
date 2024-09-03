const axios = require('axios');
const apiKey = process.env.GAPI_KEY;

/**
 * Retrieves data from Google Places API based on the provided address query.
 *
 * @param {Object} req - The incoming HTTP request with the address query.
 * @param {Object} res - The HTTP response to send.
 * @returns {Object} - The data retrieved from the Google Places API.
 */
const getDataFromAddress = async (req, res) => {
    try {
        const address = req.params.query;
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&query=${address}`;
        const response = await axios.get(url);
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        res.status(500).send("We couldn't find the location.");
    }
};

/**
 * Retrieves data from Google Places API based on nearby search parameters.
 *
 * @param {Object} req - The incoming HTTP request with nearby search parameters.
 * @param {Object} res - The HTTP response to send.
 * @param {Object} type - Type of the suggestion (bar, restaurant, ...).
 * @returns {Object} - The data retrieved from the Google Places API.
 */
const getDataByNearbySearch = async (req, res, type) => {
    const location = req.params.location;
    const radius = req.params.radius;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&key=${apiKey}&type=${type}&radius=${radius}`;
    console.log("url : ",url);
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("request data : ",data);
        return data;
    } catch (error) {
        console.error(error);
        res.status(500).send("Error. Request getDataByNearbySearch failed.");
    }
};

module.exports = {
    getDataFromAddress,
    getDataByNearbySearch
};
