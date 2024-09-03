const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const Suggestion = require('../src/models/suggestionModel');

describe('Suggestion Controller', function (){

    beforeEach(async function () {
        await Suggestion.deleteMany();
    });

    // GET ALL
    describe('GET /suggestion', function (){
        it('should get all suggestions', function (){
            return supertest(app)
                .get('/suggestion')
                .expect(200)
                .then(res => {
                    if (!Array.isArray(res.body)) {
                        throw new Error('Expected response body to be an array');
                    }
                });
        });
    });

    // POST SUGGESTION
    describe('POST /suggestion', function() {
        it('should create a suggestion', async function(){
            const suggestionData = {
                idPlace: '123',
                lon: '50.0000',
                lat: '30.0000',
                name: 'hôtel five stars',
                type: 'lodging'
            }
            const suggestion = new Suggestion(suggestionData);
            const savedSuggestion = await suggestion.save();

            assert(savedSuggestion._id);
            assert.strictEqual(savedSuggestion.idPlace, suggestionData.idPlace);
            assert.strictEqual(savedSuggestion.lon, suggestionData.lon);
            assert.strictEqual(savedSuggestion.lat, suggestionData.lat);
            assert.strictEqual(savedSuggestion.name, suggestionData.name);
            assert.strictEqual(savedSuggestion.type, suggestionData.type);
        });

        it('should not allow create a suggestion twice', async function(){
            const suggestionData = {
                idPlace: '123',
                lon: '50.0000',
                lat: '30.0000',
                name: 'hôtel five stars',
                type: 'lodging'
            }
            await Suggestion.create(suggestionData);

            try {
                Suggestion.create(suggestionData);
            } catch (error) {
                assert.strictEqual(error.message, "Suggestion with the same idPlace already exists");
            }
        });
    });

    describe("GET /suggestion/:suggestionId", function(){
        it('should get a single suggestion by id', function() {
            const suggestionData = new Suggestion({
                idPlace: '123',
                lon: '50.0000',
                lat: '30.0000',
                name: 'hôtel five stars',
                type: 'lodging'
            });
            
            return suggestionData.save()
                .then(suggestion => {
                    return supertest(app)
                        .get('/suggestion/' + suggestion._id)
                        .expect(200)
                        .then(res => {
                            if (res.body.idPlace !== '123') {
                                throw new Error('Expected idPlace to be 123');
                            }
                            if (res.body.lon !== '50.0000') {
                                throw new Error('Expected lon to be 50.0000');
                            }
                            if (res.body.lat !== '30.0000') {
                                throw new Error('Expected lat to be 30.0000');
                            }
                            if (res.body.name !== 'hôtel five stars') {
                                throw new Error('Expected name to be hôtel five stars');
                            }
                            if (res.body.type !== 'lodging') {
                                throw new Error('Expected type to be lodging');
                            }
                        });
                });
        });
    });

    describe("PUT /suggestion/:suggestionId", function(){
        it('should update a suggestion by id', function() {
            const suggestionData = new Suggestion({
                idPlace: '123',
                lon: '50.0000',
                lat: '30.0000',
                name: 'hôtel five stars',
                type: 'lodging'
            });
            
            return suggestionData.save()
                .then(suggestion => {
                    const newSuggestionData = {
                        idPlace: '1234',
                        lon: '51.0000',
                        lat: '31.0000',
                        name: 'bar four stars',
                        type: 'bar'
                    }
                    console.log('Request Body:', newSuggestionData); 
                    return supertest(app)
                        .put('/suggestion/' + suggestion._id)
                        .send(newSuggestionData)
                        .expect(200)
                        .then(res => {
                            const updatedSuggestion = res.body.suggestion;
                            if (updatedSuggestion.idPlace !== newSuggestionData.idPlace) {
                                throw new Error(`Expected idPlace to be ${newSuggestionData.idPlace}, but got ${updatedSuggestion.idPlace}`);
                            }
                            if (updatedSuggestion.lon !== newSuggestionData.lon) {
                                throw new Error(`Expected lon to be ${newSuggestionData.lon}, but got ${updatedSuggestion.lon}`);
                            }
                            if (updatedSuggestion.lat !== newSuggestionData.lat) {
                                throw new Error(`Expected lat to be ${newSuggestionData.lat}, but got ${updatedSuggestion.lat}`);
                            }
                            if (updatedSuggestion.name !== newSuggestionData.name) {
                                throw new Error(`Expected name to be ${newSuggestionData.name}, but got ${updatedSuggestion.name}`);
                            }
                            if (updatedSuggestion.type !== newSuggestionData.type) {
                                throw new Error(`Expected type to be ${newSuggestionData.type}, but got ${updatedSuggestion.type}`);
                            }
                        });
                });
        });
    });

    describe("DELETE /suggestion/:suggestionId", function(){
        it("should delete a suggestion", function(){
            const suggestionData = new Suggestion({
                idPlace: '123',
                lon: '50.0000',
                lat: '30.0000',
                name: 'hôtel five stars',
                type: 'lodging'
            }); 
            
            return suggestionData.save()
                .then(suggestion => {
                    return supertest(app)
                        .delete('/suggestion/' + suggestion._id)
                        .expect(200)
                        .then(res => {
                            if (res.body.message !== 'Suggestion deleted successfully') {
                                throw new Error(`Expected response body to be 'Suggestion deleted successfully'`);
                            }
                        });
                });
        });
    });
});