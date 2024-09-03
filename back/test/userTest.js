const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

describe('User Model', function () {

    before(function () {
        const mongoURI = 'mongodb+srv://admin:ewuXrOL2cQQym9Rq@cluster0.gwkwwvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        return mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    });
    

    beforeEach(function () {
        mongoose.connection.collections.users.deleteMany({})
    });

    it('should create a new user', async function () {
        const userData = {
            firstname: 'Yassine',
            lastname: 'Test',
            mail: 'yassine@example.com',
            password: 'adminTest123'
        };

        const user = new User(userData);
        const savedUser = await user.save();

        assert(savedUser._id);
        assert.strictEqual(savedUser.firstname, userData.firstname);
        assert.strictEqual(savedUser.lastname, userData.lastname);
        assert.strictEqual(savedUser.mail, userData.mail);
        assert(savedUser.password);
    });

  // Test unique email constraint
    it('should not allow duplicate email addresses', async function () {
    const userData = {
        firstname: 'Yassine',
        lastname: 'Test',
        mail: 'yassine@example.com',
        password: 'adminTest123'
    };

    // Create a user with the same email address
    await User.create(userData);

    // Attempt to create a user with the same email address again
    try {
        User.create(userData);
    } catch (error) {
        // Check if the error message contains the expected message
        assert.strictEqual(error.message, 'User already exists');
    }
    });

    it('should reject invalid firstname', async function () {
        const user = new User({ firstname: 'Yassine1' }); // Invalid firstname
    
        try {
          await user.validate();
        } catch (error) {
          assert.strictEqual(error.errors.firstname.message, 'Yassine1 is not valid. First name must contain only alphabetic characters and can\'t be empty.');
        }
      });
    
      it('should reject invalid lastname', async function () {
        const user = new User({ lastname: 'Test1' }); // Invalid lastname
    
        try {
          await user.validate();
        } catch (error) {
          assert.strictEqual(error.errors.lastname.message, 'Test1 is not valid. Last name must contain only alphabetic characters and can\'t be empty.');
        }
      });
    
      it('should reject invalid email address', async function () {
        const user = new User({ mail: 'invalide@mail' }); // Invalid email
    
        try {
          await user.validate();
        } catch (error) {
          assert.strictEqual(error.errors.mail.message, 'invalide@mail is not a valid email address!');
        }
      });

    after(async function () {
        await User.deleteMany();
    });
      
    // Disconnect from MongoDB after tests
    after(function () {
        return mongoose.connection.close();
    });
});
