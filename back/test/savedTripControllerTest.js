const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const SavedTrip = require('../src/models/savedTripModel');
const User = require('../src/models/userModel');
const Journey = require('../src/models/journeyModel');
const Suggestion = require('../src/models/suggestionModel');

describe('Saved Trip Controller', function (){

    beforeEach(async function () {
        await SavedTrip.deleteMany();
        await User.deleteMany();
        await Journey.deleteMany();
        await Suggestion.deleteMany();
    });

    // Helper function to create user, journey, and suggestion documents
    async function createTestData() {
        const user = await User.create({
            firstname: 'Yassine',
            lastname: 'Test',
            mail: 'yassine2@example.com',
            password: 'admintest123'
        });
        const journey = await Journey.create({
            title: "trajet boulot",
            departure: '52.0000,32.0000',
            arrival: '53.0000,33.0000'
        });
        const suggestion = await Suggestion.create({ idPlace: '123', lon: '50.0000', lat: '30.0000', name: 'testSuggestion', type: 'testType' });

        return { user, journey, suggestion };
    }

    // CREATE SAVED TRIP
    describe('POST /savedTrip', function() {
        it('should create a saved trip', async function(){
            const { user, journey, suggestion } = await createTestData();

            const savedTripData = {
                userId: user._id,
                journeyId: journey._id,
                suggestionId: suggestion._id
            }

            const savedTrip = new SavedTrip(savedTripData);
            const savedTripResponse = await savedTrip.save();

            assert(savedTripResponse._id);
            assert.strictEqual(savedTripResponse.userId.toString(), savedTripData.userId.toString());
            assert.strictEqual(savedTripResponse.journeyId.toString(), savedTripData.journeyId.toString());
            assert.strictEqual(savedTripResponse.suggestionId.toString(), savedTripData.suggestionId.toString());
        });

        it('should not allow creating the same saved trip twice', async function(){
            const { user, journey, suggestion } = await createTestData();

            const savedTripData = {
                userId: user._id,
                journeyId: journey._id,
                suggestionId: suggestion._id
            }
            await SavedTrip.create(savedTripData);

            try {
                SavedTrip.create(savedTripData);
            } catch (error) {
                assert.strictEqual(error.message, "Saved trip with the same userId, journeyId, and suggestionId already exists");
            }
        });
    });

    // GET SAVED TRIPS BY USER ID
    describe("GET /savedTrip/:userId", function(){
        it('should get saved trips by user id', async function() {
            const { user, journey, suggestion } = await createTestData();

            const savedTripData = new SavedTrip({
                userId: user._id,
                journeyId: journey._id,
                suggestionId: suggestion._id
            });
            
            await savedTripData.save();
            
            return supertest(app)
                .get(`/savedTrip/${user._id}`)
                .expect(200)
                .then(res => {
                    assert(Array.isArray(res.body));
                    assert.strictEqual(res.body.length, 1);
                    assert.strictEqual(res.body[0].userId.toString(), user._id.toString());
                });
        });
    });

    // GET SAVED TRIPS BY USER ID AND JOURNEY ID
    describe("GET /savedTrip/:userId/:journeyId", function(){
        it('should get saved trips by user id and journey id', async function() {
            const { user, journey, suggestion } = await createTestData();

            const savedTripData = new SavedTrip({
                userId: user._id,
                journeyId: journey._id,
                suggestionId: suggestion._id
            });
            
            await savedTripData.save();
            
            return supertest(app)
                .get(`/savedTrip/${user._id}/${journey._id}`)
                .expect(200)
                .then(res => {
                    assert(Array.isArray(res.body));
                    assert.strictEqual(res.body.length, 1);
                    assert.strictEqual(res.body[0].userId.toString(), user._id.toString());
                    assert.strictEqual(res.body[0].journeyId.toString(), journey._id.toString());
                });
        });
    });

    // DELETE SAVED TRIP
    describe("DELETE /savedTrip/:savedTripId", function(){
        it("should delete a saved trip", async function(){
            const { user, journey, suggestion } = await createTestData();
    
            const savedTripData = new SavedTrip({
                userId: user._id,
                journeyId: journey._id,
                suggestionId: suggestion._id
            }); 
            
            const savedTrip = await savedTripData.save();
    
            return supertest(app)
                .delete(`/savedTrip/${savedTrip._id}`)
                .expect(200)
                .then(res => {
                    assert.strictEqual(res.body.message, 'Saved Trip deleted successfully!');
                });
        });
    });
    
});
