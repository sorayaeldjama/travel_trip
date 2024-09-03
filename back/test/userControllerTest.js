const supertest = require('supertest');
const app = require('../app');
const User = require('../src/models/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

describe('User Controller', function () {

    beforeEach(async function () {
        await User.deleteMany();
    });

    // GET ALL
    describe('GET /users', function () {
        it('should get all users', function () {
            return supertest(app)
                .get('/users')
                .expect(200)
                .then(res => {
                    if (!Array.isArray(res.body)) {
                        throw new Error('Expected response body to be an array');
                    }
                });
        });
    });

    // GET BY ID
    describe('GET /users/profile/:id', function () {
        it('should get a single user by id', function () {
            // First, create a user
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(user => {
                    // Then, make a request to get the user by id
                    return supertest(app)
                        .get('/users/profile/' + user._id)
                        .expect(200)
                        .then(res => {
                            if (res.body.firstname !== 'Yassine') {
                                throw new Error('Expected firstname to be Yassine');
                            }
                            if (res.body.lastname !== 'Test') {
                                throw new Error('Expected lastname to be Test');
                            }
                            if (res.body.mail !== 'yassine@example.com') {
                                throw new Error('Expected mail to be yassine@example.com');
                            }
                        });
                });
        });
    });

    // DELETE USER
    describe('DELETE /users/profile/:id', function () {
        it('should delete a user by id', function () {
            // First, create a user
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine2@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(user => {

                    // Then, make a request to delete the user by id
                    return supertest(app)
                        .delete('/users/profile/' + user._id)
                        .expect(200)
                        .then(res => {
                            if (res.body !== 'User deleted successfully !') {
                                throw new Error('Expected response body to be "User deleted successfully !"');
                            }
                        });
                });
        });
    });

    // UPDATE USER
    describe('PUT /users/profile/:id', function () {
        it('should update a user by id', function () {
            // First, create a user
            const newUser = new User({
                firstname: 'Yassine',
                lastname: 'Test',
                mail: 'yassine3@example.com',
                password: 'admintest123'
            });

            return newUser.save()
                .then(user => {
                    // Then, make a request to update the user by id
                    const updatedUserData = {
                        firstname: 'YassineNew',
                        lastname: 'TestNew',
                        mail: 'yassine4@example.com',
                        password: 'admintest1234'
                    };

                    return supertest(app)
                        .put('/users/profile/' + user._id)
                        .send(updatedUserData)
                        .expect(200)
                        .then(res => {
                            if (res.body.firstname !== 'YassineNew') {
                                throw new Error('Expected firstname to be YassineNew');
                            }
                            if (res.body.lastname !== 'TestNew') {
                                throw new Error('Expected lastname to be TestNew');
                            }
                            if (res.body.mail !== 'yassine4@example.com') {
                                throw new Error('Expected mail to be yassine4@example.com');
                            }

                            // Check if password has been hashed
                            return bcrypt.compare('admintest1234', res.body.password);
                        })
                        .then(result => {
                            if (!result) {
                                throw new Error('Password is not hashed');
                            }
                        });
                });
        });
    });

    after(async function () {
        await User.deleteMany();
    });
});
