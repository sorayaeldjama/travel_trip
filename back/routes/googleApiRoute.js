var express = require('express');
var router = express.Router();
var googleApiController = require("../src/controllers/googleApiController");


// routes
router.get("/location/:query", googleApiController.getLocationFromAddress);
router.get("/search_nearby/travel/:location/:radius", googleApiController.getTravelSuggestionsFromLocation);
router.get("/search_nearby/eat/:location/:radius", googleApiController.getEatSuggestionsFromLocation);
router.get("/search_nearby/sleep/:location/:radius", googleApiController.getSleepSuggestionsFromLocation);
router.get("/search_nearby/drink/:location/:radius", googleApiController.getDrinkSuggestionsFromLocation);


module.exports = router;