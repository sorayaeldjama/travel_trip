const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const Journey = require('../src/models/journeyModel');

describe('Journey Controller', function () {

    beforeEach(async function () {
        await Journey.deleteMany();
    });

    // POST JOURNEY
    describe('POST /journey', function () {
        it('should create a journey', async function () {
            const journeyData = {
                title: "trajet boulot",
                departure: '50.0000,30.0000',
                arrival: '51.0000,31.0000'
            }
            const journey = new Journey(journeyData);
            const savedJourney = await journey.save();

            assert(savedJourney._id);
            assert.strictEqual(savedJourney.departure, journeyData.departure);
            assert.strictEqual(savedJourney.arrival, journeyData.arrival);
        });
    });

    // GET ALL JOURNEYS
    describe('GET /journey', function () {
        it('should get all journeys', function () {
            return supertest(app)
                .get('/journey')
                .expect(200)
                .then(res => {
                    if (!Array.isArray(res.body)) {
                        throw new Error('Expected response body to be an array');
                    }
                });
        });
    });

    // GET JOURNEY BY ID
    describe('GET /journey/:journeyId', function () {
        it('should get a single journey by id', function () {
            const journeyData = new Journey({
                title: "trajet boulot",
                departure: '50.0000,30.0000',
                arrival: '51.0000,31.0000'
            });

            return journeyData.save()
                .then(journey => {
                    return supertest(app)
                        .get('/journey/' + journey._id)
                        .expect(200)
                        .then(res => {
                            if (res.body.title !== 'trajet boulot') {
                                throw new Error('Expected title to be trajet boulot');
                            }
                            if (res.body.departure !== '50.0000,30.0000') {
                                throw new Error('Expected departure to be 50.0000,30.0000');
                            }
                            if (res.body.arrival !== '51.0000,31.0000') {
                                throw new Error('Expected arrival to be 51.0000,31.0000');
                            }
                        });
                });
        });
    });

    // PUT JOURNEY
    describe('PUT /journey/:journeyId', function () {
        it('should update a journey by id', function () {
            const journeyData = new Journey({
                title: "trajet boulot",
                departure: '50.0000,30.0000',
                arrival: '51.0000,31.0000'
            });

            return journeyData.save()
                .then(journey => {
                    const newJourneyData = {
                        title: "trajet maison",
                        departure: '52.0000,32.0000',
                        arrival: '53.0000,33.0000'
                    }
                    return supertest(app)
                        .put('/journey/' + journey._id)
                        .send(newJourneyData)
                        .expect(200)
                        .then(res => {
                            const updatedJourney = res.body.journey;
                            if (updatedJourney.title !== newJourneyData.title) {
                                throw new Error(`Expected departure to be ${newJourneyData.departure}, but got ${updatedJourney.departure}`);
                            }
                            if (updatedJourney.departure !== newJourneyData.departure) {
                                throw new Error(`Expected departure to be ${newJourneyData.departure}, but got ${updatedJourney.departure}`);
                            }
                            if (updatedJourney.arrival !== newJourneyData.arrival) {
                                throw new Error(`Expected arrival to be ${newJourneyData.arrival}, but got ${updatedJourney.arrival}`);
                            }
                        });
                });
        });
    });

    // DELETE JOURNEY
    describe('DELETE /journey/:journeyId', function () {
        it("should delete a journey", function () {
            const journeyData = new Journey({
                title: "trajet boulot",
                departure: '50.0000,30.0000',
                arrival: '51.0000,31.0000'
            });

            return journeyData.save()
                .then(journey => {
                    return supertest(app)
                        .delete('/journey/' + journey._id)
                        .expect(200)
                        .then(res => {
                            if (res.body.message !== 'Journey deleted successfully') {
                                throw new Error(`Expected response body to be 'Journey deleted successfully'`);
                            }
                        });
                });
        });
    });

    after(async function () {
        await Journey.deleteMany();
    });
});
