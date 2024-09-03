// Import required functions from the Google API service.
const { getDataFromAddress, getDataByNearbySearch} = require("../../services/googleApi");


/** 
* Retrieves location coordinates from the given address query.
 * @param {Object} req - The request object containing the address query.
 * @param {Object} res - The response object used to send the location coordinates.
 * @returns {void}
*/
exports.getLocationFromAddress = async (req, res) => {
  try {
    const query = req.params.query;
    if (!query) {
      return res.status(400).json({ error: "Missing address parameter" });
    }
  
    const data = await getDataFromAddress(req, res);
    const response = data.results[0].geometry.location;
    res.json(response);

  } catch (error) {
    console.error("Error fetching address location :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieves drink suggestions for places near the specified location.
 * 
 * @param {Object} req - The request object containing location parameters.
 * @param {Object} res - The response object used to send the suggestions.
 * @returns {void}
 */
exports.getDrinkSuggestionsFromLocation = async (req, res) => {
  await getSuggestionsFromLocation(req, res, 'bar');
};

/**
 * Retrieves eat suggestions for places near the specified location.
 * 
 * @param {Object} req - The request object containing location parameters.
 * @param {Object} res - The response object used to send the suggestions.
 * @returns {void}
 */
exports.getEatSuggestionsFromLocation = async (req, res) => {
  await getSuggestionsFromLocation(req, res, 'restaurant');
};

/**
 * Retrieves sleep suggestions for places near the specified location.
 * 
 * @param {Object} req - The request object containing location parameters.
 * @param {Object} res - The response object used to send the suggestions.
 * @returns {void}
 */
exports.getSleepSuggestionsFromLocation = async (req, res) => {
  await getSuggestionsFromLocation(req, res, 'lodging');
};

/**
 * Retrieves travel suggestions for places near the specified location.
 * 
 * @param {Object} req - The request object containing location parameters.
 * @param {Object} res - The response object used to send the suggestions.
 * @returns {void}
 */
exports.getTravelSuggestionsFromLocation = async (req, res) => {
  await getSuggestionsFromLocation(req, res, 'train_station');
};

/**
 * Retrieves suggestions for places near the specified location.
 * @param {Object} req - The request object containing location parameters.
 * @param {Object} res - The response object used to send the suggestions.
 * @param {Object} type - Type of the suggestion (bar, restaurant, ...).
 * @returns {void}
 */
getSuggestionsFromLocation = async (req, res, type) => {
  try {
    const location = req.params.location;
    const radius = req.params.radius;
    if (!location || !radius || !type){
      return res.status(400).json({ error: "Missing parameter"});
    }

    // fetch and filter the data.
    const data = await getDataByNearbySearch(req,res,type);
    const response = [];
    for (const place of data.results) {
      const suggestion = 
      { 
        id: place.place_id,
        business_status: place.business_status,
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        type: place.types,
        photo: place.photos,
        price_level: place.price_level ? place.price_level : undefined,
        location: place.geometry.location,
      };
      response.push(suggestion);
    }
    res.json(response);
  } catch (error) {
    console.error("Error fetching bar data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
