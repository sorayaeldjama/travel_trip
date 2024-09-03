import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import Header from "../components/Header";
import { getLocation, getEatNearbySuggestions, savePivot, saveSuggestion, saveJourney, getDrinkNearbySuggestions, getTravelNearbySuggestions, getSleepNearbySuggestions } from "../utils/Api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCog, faClose, faSave } from "@fortawesome/free-solid-svg-icons";
import Routing from "../components/Routing"
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Collapsible from 'react-collapsible';
import Modal from 'react-modal';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Tooltip as ReactTooltip } from "react-tooltip";

export const TripPage = () => {

    /**
     * Etat d'ouverture de la modal de paramétrage
     */
    const [modalParameterIsOpen, setModalParameterIsOpen] = useState(false);

    /**
     * Suggestions à sauvegarder
     */
    const [suggestionsToSave, setSuggestionsToSave] = useState([]);

    /**
    * Etat d'ouverture de la modal de détails
    */
    const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);

    /**
    * Détail courant à afficher dans la boite de dialogue
    */
    const [modalDetailPlaceCurrentValue, setModalDetailPlaceCurrentValue] = useState(false);

    /**
     * Position d'epitech
     */
    const position = [50.63706191723072, 3.058410839869353];

    /**
     * Valeur du diamêtre des suggestion.
     */
    const [radius, setRadius] = useState(5);

    /**
 * État local pour gérer les paramètres des cases à cocher.
 * Chaque paramètre représente une option de suggestion.
 */
    const [checkBoxsParameters, setCheckBoxsParameters] = React.useState({
        eatParameter: true,
        sleepParameter: true,
        travelParameter: true,
        drinkParameter: true
    });

    // Extraction des paramètres des cases à cocher pour une utilisation plus facile.
    const { eatParameter, sleepParameter, travelParameter, drinkParameter } = checkBoxsParameters;

    /**
     * Contient les suggestion des restaurants à proximité.
     */
    const [eatResults, setEatResults] = useState([]);

    /**
     * Contient les suggestion des bars à proximité.
     */
    const [drinkResults, setDrinkResults] = useState([]);

    /**
     * Contient les suggestion des moyens de transport à proximité.
     */
    const [travelResults, setTravelResults] = useState([]);

    /**
     * Contient les suggestion des hotels à proximité.
     */
    const [sleepResults, setSleepResults] = useState([]);

    /**
     * Position de l'adresse de destination saisie
     */
    const [departureAddressPosition, setDestinationAddressPosition] = useState(null);

    /**
     * Position de l'adresse de destination saisie
     */
    const [destinationAdressPosition, setdestinationAdressPosition] = useState(null);

    /**
     * valeur saisie pour l'adresse de départ
     */
    const [inputDepartureAdressValue, setInputDepartureAdressValue] = useState('');

    /**
     * valeur saisie pour l'adresse de destination
     */
    const [inputDestinationAdressValue, setInputDestinationAdressValue] = useState('');

    /**
     * Position du marqueur 
     */
    const [markerPosition, setMarkerPosition] = useState(null);

    /**
     * Affichage des éléments aprés recherche d'une adresse
     */
    const [inputVisible, setInputVisible] = useState(false);

    /**
     * Ajout un marqueur à la location du clique reçu sur la map
     * @param {*} param0 
     * @returns 
     */
    const HandleClickLocationMarker = ({ setMarkerPosition }) => {
        useMapEvents({
            click(event) {
                setMarkerPosition(event.latlng);
            },
        });

        return null;
    };

    /**
    * Fonction de gestion du changement des cases à cocher.
    * Met à jour les paramètres des cases à cocher en fonction de l'événement de changement.
    */
    const handleCheckBoxsChange = (event) => {
        setCheckBoxsParameters({
            ...checkBoxsParameters,
            [event.target.name]: event.target.checked,
        });
    };

    /**
    * Fonction de gestion du changement des cases à cocher.
    * Met à jour le tableau des suggestion à sauvegarder.
    */
    const handleSaveCheckBoxsChange = (event, place, type) => {
        place.type = type;

        // Si la case est cochée, ajoutez la suggestion
        if (event.target.checked) {
            setSuggestionsToSave([...suggestionsToSave, place]);
        } else { // Si la case est décochée, retirez la suggestion
            setSuggestionsToSave(suggestionsToSave.filter((item) => item !== place));
        }
    };

    /**
 * Transforme les coordonnées en chaîne de caractères au format "latitude,longitude"
 * @param {number} latitude La latitude
 * @param {number} longitude La longitude
 * @returns {string} Les coordonnées au format "latitude,longitude"
 */
    const formatCoordinates = (latitude, longitude) => {
        return latitude + ',' + longitude;
    };

    /**
    * Fonction de sauvegarde de trajet.
    */
    const handleSaveTrip = async (event) => {
        try {
            const userId = localStorage.getItem('user_id');

            let departureAddressString = formatCoordinates(departureAddressPosition.lat, departureAddressPosition.lng);
            let destinationAddressString = formatCoordinates(destinationAdressPosition.lat, destinationAdressPosition.lng);

            // Créer le trajet et récupérer son ID
            let journeyId = await saveJourney(departureAddressString, destinationAddressString, inputDestinationAdressValue);

            // Parcourir chaque suggestion à sauvegarder
            for (let suggestion of suggestionsToSave) {
                // Sauvegarder la suggestion
                let suggestionId = await saveSuggestion(suggestion.id, suggestion.location.lat.toString(), suggestion.location.lng.toString(), suggestion.name, suggestion.type);
        
                // Sauvegarder la relation entre l'utilisateur, le trajet et la suggestion
                let test = await savePivot(userId, journeyId._id, suggestionId._id);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la sauvegarde des suggestions :", error);
        }
    };

    /**
     * Event de changement de valeur du paramétre du diamêtre de sélection des suggestions
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleRadiusChange = (event, newValue) => {
        setRadius(newValue);
    };

    /**
     * Fonction utiliser lors de la recherche d'une adresse par l'utilisateur
     * 
     * Permet de faire les call API des suggestion 
     */
    const handleSearch = async () => {
        setInputVisible(true);

        // reinitialise les suggestion sauvegarder 
        suggestionsToSave.splice(0, suggestionsToSave.length);

        const location = await getLocation(inputDestinationAdressValue);

        // Obtenez les suggestions de restaurants et de boissons si la case à cocher correspondante est cochée
        if (eatParameter) {
            const eatResults = await getEatNearbySuggestions(location.lat + "," + location.lng, radius * 1000);
            const filteredEatResults = eatResults.filter(place => !place.type.includes('lodging'));
            setEatResults(filteredEatResults);
        }

        if (drinkParameter) {
            const drinkResults = await getDrinkNearbySuggestions(location.lat + "," + location.lng, radius * 1000);
            const filteredDrinkResults = drinkResults.filter(place => !place.type.includes('lodging'));
            setDrinkResults(filteredDrinkResults);
        }

        // Obtenir et définir les suggestions de voyage si la case à cocher correspondante est cochée
        if (travelParameter) {
            const travelResults = await getTravelNearbySuggestions(location.lat + "," + location.lng, radius * 1000);
            setTravelResults(travelResults);
        }

        // Obtenir et définir les suggestions de sommeil si la case à cocher correspondante est cochée
        if (sleepParameter) {
            const sleepResults = await getSleepNearbySuggestions(location.lat + "," + location.lng, radius * 1000);
            setSleepResults(sleepResults);
        }

        // Définir la position de l'adresse de destination
        setdestinationAdressPosition(location);
    };

    /**
     * Changement de la valeur de l'adresse de destination
     * @param {*} event 
     */
    const handleInputDepartureAdressChange = (event) => {
        setInputDepartureAdressValue(event.target.value);
    };

    /**
     * Changement de la valeur de l'adresse de départ
     * @param {*} event 
     */
    const handleInputDestinationAdressChange = (event) => {
        setInputDestinationAdressValue(event.target.value);
    };

    /**
     * Evenement de fin de saisie de l'adresse de départ
     * 
     * Initie en conséquence un itinéraire
     */
    const handleBlurDepartureAdress = async () => {
        let location = null;

        // reinitialise les suggestion sauvegarder 
        suggestionsToSave.splice(0, suggestionsToSave.length);

        // Uniquement si l'adresse de départ à était saisie
        if (inputDepartureAdressValue) {
            location = await getLocation(inputDepartureAdressValue);
        }

        setDestinationAddressPosition(location);
    };

    /**
     * Evenement lorsque la touche entrée est utilisé dans l'input de l'adresse
     * @param {*} event 
     */
    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            let location = null;

            // reinitialise les suggestion sauvegarder 
            suggestionsToSave.splice(0, suggestionsToSave.length);

            // Uniquement si l'adresse de départ à était saisie
            if (inputDepartureAdressValue) {
                location = await getLocation(inputDepartureAdressValue);
            }

            setDestinationAddressPosition(location);
        }
    };

    /**
     * Ouvre ou ferme la modal de paramétrage selon son état actuelle.
     */
    const toggleModalParameter = () => {
        setModalParameterIsOpen(!modalParameterIsOpen);
    };

    /**
    * Ouvre ou ferme la modal de détail selon son état actuelle.
    */
    const toggleModalDetail = () => {
        setModalDetailIsOpen(!modalDetailIsOpen);
    };

    return (
        <div className="w-full h-full">
            <Header />
            <div className="flex h-90% justify-center">
                <div className="w-30% h-90% flex flex-col ">
                    {inputVisible &&
                        <input
                            type="text"
                            placeholder="Departure address"
                            value={inputDepartureAdressValue}
                            onChange={handleInputDepartureAdressChange}
                            onBlur={handleBlurDepartureAdress}
                            onKeyUp={handleKeyPress}
                            className="pl-4 mb-4 ml-12 input-no-focus border-2 border-gray-400 rounded-md w-80% min-h-10 text-black border-gray-300 rounded-md shadow-sm block"
                        />}
                    <div className="flex w-80% ml-12 min-h-10 flex-row">
                        <div className="flex min-h-10 flex-row w-full border-2 border-gray-400 rounded-md">
                            <input
                                type="text"
                                data-tooltip-id="destination-tooltip"
                                value={inputDestinationAdressValue}
                                onChange={handleInputDestinationAdressChange}
                                placeholder="Destination address"
                                className="pl-4 input-no-focus focus:border-transparent border-none rounded-l-md w-80% h-full text-black"
                            />
                            <button onClick={handleSearch} className="h-full flex items-center justify-end pr-4 w-20% bg-white border-none text-black rounded-r-md">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                        <button onClick={toggleModalParameter} className="ml-12 flex items-center justify-center h-full text-white bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-base px-4 py-2">
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                    <div id="collapsible-list" className="bg-white ml-12 mt-4 overflow-hidden border-solid border-2 border-gray-400 rounded-xl w-80% h-70% max-h-full">
                        <div className="h-full overflow-y-auto max-h-80%">
                            {eatParameter && (
                                <Collapsible trigger="Eat">
                                    {eatResults.length > 0 ? (
                                        eatResults.map((place, index) => (
                                            <div key={index} className="flex flex-row justify-around items-center mb-2">
                                                <p className="hover:bg-blue-200 w-90% p-1 pl-2 pr-2 rounded-xl" onClick={() => {
                                                    toggleModalDetail();
                                                    setModalDetailPlaceCurrentValue(place);
                                                }}>
                                                    {place.name}
                                                </p>
                                                <FormControlLabel
                                                    onChange={(event) => handleSaveCheckBoxsChange(event, place, "eat")}
                                                    control={<Checkbox name="save" />}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No places to eat nearby</p>
                                    )}
                                </Collapsible>
                            )}
                            {sleepParameter && (
                                <Collapsible trigger="Sleep">
                                    {sleepResults.length > 0 ? (
                                        sleepResults.map((place, index) => (
                                            <div key={index} className="flex flex-row justify-around items-center mb-2">
                                                <p className="hover:bg-blue-200 w-90% p-1 pl-2 pr-2 rounded-xl" onClick={() => {
                                                    toggleModalDetail();
                                                    setModalDetailPlaceCurrentValue(place);
                                                }}>
                                                    {place.name}
                                                </p>
                                                <FormControlLabel
                                                    onChange={(event) => handleSaveCheckBoxsChange(event, place, "sleep")}
                                                    control={<Checkbox name="save" />}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No places to sleep nearby</p>
                                    )}
                                </Collapsible>
                            )}
                            {travelParameter && (
                                <Collapsible trigger="Travel">
                                    {travelResults.length > 0 ? (
                                        travelResults.map((place, index) => (
                                            <div key={index} className="flex flex-row justify-around items-center mb-2">
                                                <p className="hover:bg-blue-200 w-90% p-1 pl-2 pr-2 rounded-xl" onClick={() => {
                                                    toggleModalDetail();
                                                    setModalDetailPlaceCurrentValue(place);
                                                }}>
                                                    {place.name}
                                                </p>
                                                <FormControlLabel
                                                    onChange={(event) => handleSaveCheckBoxsChange(event, place, "travel")}
                                                    control={<Checkbox name="save" />}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No places to travel nearby</p>
                                    )}
                                </Collapsible>
                            )}
                            {drinkParameter && (
                                <Collapsible trigger="Drink">
                                    {drinkResults.length > 0 ? (
                                        drinkResults.map((place, index) => (
                                            <div key={index} className="flex flex-row justify-around items-center mb-2">
                                                <p className="hover:bg-blue-200 w-90% p-1 pl-2 pr-2 rounded-xl" onClick={() => {
                                                    toggleModalDetail();
                                                    setModalDetailPlaceCurrentValue(place);
                                                }}>
                                                    {place.name}
                                                </p>
                                                <FormControlLabel
                                                    onChange={(event) => handleSaveCheckBoxsChange(event, place, "drink")}
                                                    control={<Checkbox name="save" />}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-400">No places to drink nearby</p>
                                    )}
                                </Collapsible>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => handleSaveTrip()}
                        className="w-80% ml-12 mt-4 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save
                    </button>
                </div>
                <div className="w-70% flex justify-center">
                    <MapContainer
                        center={position} zoom={13}
                        className="h-90% rounded-xl"
                        style={{ width: "95%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <HandleClickLocationMarker setMarkerPosition={setMarkerPosition} />
                        {/* Affcihage de marqueur des suggestions */}
                        {drinkResults.map((place, index) => (
                            <Marker key={index} position={[place.location.lat, place.location.lng]}>
                                <Popup>
                                    <div>
                                        <h2>{place.name}</h2>
                                        <p>{place.address}</p>
                                    </div>
                                </Popup>
                            </Marker>))}
                        {eatResults.map((place, index) => (
                            <Marker key={index} position={[place.location.lat, place.location.lng]}>
                                <Popup>
                                    <div>
                                        <h2>{place.name}</h2>
                                        <p>{place.address}</p>
                                    </div>
                                </Popup>
                            </Marker>))}
                        {sleepResults.map((place, index) => (
                            <Marker key={index} position={[place.location.lat, place.location.lng]}>
                                <Popup>
                                    <div>
                                        <h2>{place.name}</h2>
                                        <p>{place.address}</p>
                                    </div>
                                </Popup>
                            </Marker>))}
                        {travelResults.map((place, index) => (
                            <Marker key={index} position={[place.location.lat, place.location.lng]}>
                                <Popup>
                                    <div>
                                        <h2>{place.name}</h2>
                                        <p>{place.address}</p>
                                    </div>
                                </Popup>
                            </Marker>))}
                        {/* Marqueur au clique utilisateur*/}
                        {markerPosition && (
                            <Marker position={markerPosition} />
                        )}
                        {/* Itinéraire entre l'addresse de départ et d'arrivée */}
                        {destinationAdressPosition && departureAddressPosition && (
                            <Routing
                                startPoint={departureAddressPosition}
                                endPoint={destinationAdressPosition}
                            />
                        )}
                    </MapContainer>
                </div>
            </div>
            <Modal
                isOpen={modalParameterIsOpen}
                onRequestClose={toggleModalParameter}
                className={`modal w-30% flex items-center flex-col ${modalParameterIsOpen ? 'modal-open' : ''}`}
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                <div className="flex w-full flex-row justify-between items-center">
                    <h2 className="text-xl font-bold text-left">Suggestion parameters filter</h2>
                    <button onClick={toggleModalParameter} className="w-10 h-10 bg-red-500 flex items-center justify-center rounded hover:bg-red-600 focus:outline-none">
                        <FontAwesomeIcon icon={faClose} className="text-white" />
                    </button>
                </div>
                <div className="mt-8 flex w-90% items-center flex-col text-center">
                    <Typography id="discrete-slider" gutterBottom>
                        Distance for radius search (km)
                    </Typography>
                    <Slider
                        aria-label="Distance"
                        value={radius}
                        onChange={handleRadiusChange}
                        step={1}
                        marks
                        min={0}
                        max={10}
                        valueLabelDisplay="auto"
                    />
                    <Typography>
                        {radius} km
                    </Typography>
                    <div className="mt-8 text-left">
                        <h3>Choose the types of suggestions to display on the map:</h3>
                        <FormControlLabel
                            control={<Checkbox checked={eatParameter} onChange={handleCheckBoxsChange} name="eatParameter" />}
                            label="Eat"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={sleepParameter} onChange={handleCheckBoxsChange} name="sleepParameter" />}
                            label="Sleep"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={travelParameter} onChange={handleCheckBoxsChange} name="travelParameter" />}
                            label="Travel"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={drinkParameter} onChange={handleCheckBoxsChange} name="drinkParameter" />}
                            label="Drink"
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={modalDetailIsOpen}
                onRequestClose={toggleModalDetail}
                className={`modal w-40% flex items-center flex-col ${modalDetailIsOpen ? 'modal-open' : ''}`}
                overlayClassName="modal-overlay"
                ariaHideApp={false}
            >
                <div className="flex w-full flex-row justify-between items-center">
                    <h2 className="text-xl font-bold text-left">Places detail</h2>
                    <button onClick={toggleModalDetail} className="w-10 h-10 bg-red-500 flex items-center justify-center rounded hover:bg-red-600 focus:outline-none">
                        <FontAwesomeIcon icon={faClose} className="text-white" />
                    </button>
                </div>
                <div className="mt-8 flex w-90% items-center flex-col text-center">
                    {modalDetailPlaceCurrentValue && (
                        <>
                            <div className="flex w-full">
                                <span className="text-left font-bold w-32">Name:</span>
                                <span className="ml-2">{modalDetailPlaceCurrentValue.name}</span>
                            </div>
                            <div className="flex w-full">
                                <span className="text-left font-bold w-32">Address:</span>
                                <span className="ml-2">{modalDetailPlaceCurrentValue.address}</span>
                            </div>
                            {modalDetailPlaceCurrentValue.rating && (
                                <div className="flex w-full">
                                    <span className="text-left font-bold w-32">Rating:</span>
                                    <span className="ml-2">{modalDetailPlaceCurrentValue.rating}</span>
                                </div>
                            )}
                            {modalDetailPlaceCurrentValue.price_level && (
                                <div className="flex w-full">
                                    <span className="text-left font-bold w-32">Price Level:</span>
                                    <span className="ml-2">{modalDetailPlaceCurrentValue.price_level}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal>
            <ReactTooltip
                id="destination-tooltip"
                place="bottom"
                content="Enter the address where you want to go"
            />
        </div>
    );
};

export default TripPage;
