const supertest = require('supertest');
const app = require('../app');
const User = require('../src/models/userModel');
const bcrypt = require('bcrypt');

describe('Auth Controller', function () {

    beforeEach(async function () {
        await User.deleteMany();
    });

    // LOGIN
    describe('POST /login', function () {
        it('should login a user with correct credentials', async function () {
            // First, create a user
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(() => {
                    // Then, make a request to login with correct credentials
                    return supertest(app)
                        .post('/users/login')
                        .send({ mail: 'yassine@example.com', password: 'admintest123' })
                        .expect(200)
                        .then(res => {
                            if (!res.body.token) {
                                throw new Error('Expected token in response');
                            }
                        });
                });
        });

        it('should return error for incorrect email', function () {
            // Make a request to login with incorrect email
            return supertest(app)
                .post('/users/login')
                .send({ mail: 'wrong@example.com', password: 'admintest123' })
                .expect(401)
                .then(res => {
                    if (res.body.error !== "This mail doesn't exist.") {
                        throw new Error('Expected error message for incorrect email');
                    }
                });
        });

        it('should return error for incorrect password', async function () {
            // First, create a user
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(() => {
                    // Make a request to login with incorrect password
                    return supertest(app)
                        .post('/users/login')
                        .send({ mail: 'yassine@example.com', password: 'wrongpassword' })
                        .expect(401)
                        .then(res => {
                            if (res.body.error !== "Password incorrect.") {
                                throw new Error('Expected error message for incorrect password');
                            }
                        });
                });
        });
    });

    // REGISTER
    describe('POST /register', function () {
        it('should register a new user', function () {
            const userData = {
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine@example.com',
                password: 'admintest123'
            };

            return supertest(app)
                .post('/users/register')
                .send(userData)
                .expect(200)
                .then(res => {
                    if (!res.body.token) {
                        throw new Error('Expected token in response');
                    }
                });
        });

        it('should return error for existing email', async function () {
            // First, create a user with the same email
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(() => {
                    // Attempt to register with the same email
                    return supertest(app)
                        .post('/users/register')
                        .send({ firstname: 'Another', lastname: 'User', mail: 'yassine@example.com', password: 'anotherpassword' })
                        .expect(500)
                        .then(res => {
                            if (res.body.error !== "Internal Server Error") {
                                throw new Error('Expected error message for existing email');
                            }
                        });
                });
        });
    });

    after(async function () {
        await User.deleteMany();
    });
});
