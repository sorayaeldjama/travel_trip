import apiUrl from "../config";

/**
 * Sauvegarde un trajet
 * @param {*} departure 
 * @param {*} arrival 
 */
const saveJourney = async (departure, arrival, title) => {
    const params = {
        departure: departure,
        arrival: arrival,
        title: title
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    };

    try {
        // Faire la requête POST
        const response = await fetch(apiUrl + "/journey", options);

        return await response.json();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
};

/**
 * Sauvegarde une suggestion
 * @param {*} id 
 * @param {*} lat 
 * @param {*} lng 
 * @param {*} name 
 * @param {*} type 
 * @returns 
 */
const saveSuggestion = async (id, lat, lng, name, type) => {
    const params = {
        idPlace: id,
        lat: lat,
        lon: lng,
        name: name,
        type: type
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    };

    try {
        const response = await fetch(apiUrl + "/suggestion", options);

        return await response.json();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
};

/**
 * Crée l'enregistrement pivot
 * @param {*} userId 
 * @param {*} journeyId 
 * @param {*} suggestionId 
 * @returns 
 */
const savePivot = async (userId, journeyId, suggestionId) => {
    const params = {
        userId: userId,
        journeyId: journeyId,
        suggestionId: suggestionId
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    };

    try {
        // Faire la requête POST
        const response = await fetch(apiUrl + "/savedTrip", options);

        return await response.json();
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
};

/**
 * 
 * Récupére par un call api la localisation d'une adresse
 * 
 * @param {*} String adress
 * @returns 
 */
const getLocation = async (adress) => {
    try {
        const response = await fetch(apiUrl + '/location/' + adress);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

/**
 * Récupère les suggestions par un appel API pour un type spécifique (eat, drink, etc.).
 * 
 * @param {String} type - Le type de suggestion (par exemple, "eat" pour les restaurants).
 * @param {String} location - L'adresse ou les coordonnées GPS du lieu.
 * @param {Number} radius - Le rayon de recherche en mètres.
 * @returns {Promise} - Une promesse résolue avec les données récupérées.
 */
const getSuggestionsByType = async (type, location, radius) => {
    try {
        const response = await fetch(`${apiUrl}/search_nearby/${type}/${location}/${radius}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

/**
 * Récupère les suggestions de lieux de restauration à proximité.
 * 
 * @param {String} location - L'adresse ou les coordonnées GPS du lieu.
 * @param {Number} radius - Le rayon de recherche en mètres.
 * @returns {Promise} - Une promesse résolue avec les données récupérées.
 */
const getEatNearbySuggestions = async (location, radius) => {
    return getSuggestionsByType('eat', location, radius);
};

/**
 * Récupère les suggestions de lieux ou se reposer à proximité.
 * 
 * @param {String} location - L'adresse ou les coordonnées GPS du lieu.
 * @param {Number} radius - Le rayon de recherche en mètres.
 * @returns {Promise} - Une promesse résolue avec les données récupérées.
 */
const getSleepNearbySuggestions = async (location, radius) => {
    return getSuggestionsByType('sleep', location, radius);
};

/**
 * Récupère les suggestions des moyens de transport à proximité.
 * 
 * @param {String} location - L'adresse ou les coordonnées GPS du lieu.
 * @param {Number} radius - Le rayon de recherche en mètres.
 * @returns {Promise} - Une promesse résolue avec les données récupérées.
 */
const getTravelNearbySuggestions = async (location, radius) => {
    return getSuggestionsByType('travel', location, radius);
};

/**
 * Récupère les suggestions de lieux de boissons à proximité.
 * 
 * @param {String} location - L'adresse ou les coordonnées GPS du lieu.
 * @param {Number} radius - Le rayon de recherche en mètres.
 * @returns {Promise} - Une promesse résolue avec les données récupérées.
 */
const getDrinkNearbySuggestions = async (location, radius) => {
    return getSuggestionsByType('drink', location, radius);
};

export { getLocation, getEatNearbySuggestions, getDrinkNearbySuggestions, getTravelNearbySuggestions, getSleepNearbySuggestions, savePivot, saveJourney, saveSuggestion };