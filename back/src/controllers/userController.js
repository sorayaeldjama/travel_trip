const User = require("../models/userModel");
const bcrypt = require("bcrypt");

/**
 * Retrieves all users from the database.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.getAll = (req, res) => {
    User.find().exec()
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => {
        return res.status(500).json(err);
      })
};

/**
 * Retrieves a user by ID from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.getById = (req, res) => {
    User.findById(req.params.id).exec()
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      return res.status(500).json(err);
    })
};

/**
 * Deletes a user from the database by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.delete = async (req, res) => {
    try {
      // Delete the user
      const result = await User.findOneAndDelete({ _id: req.params.id }).exec();

      if (!result) {
        return res
          .status(404)
          .json("User with id " + req.params.id + " is not found !");
      }
      
      return res.status(200).json("User deleted successfully !");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Updates a user in the database by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
exports.update = async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, mail, password } = req.body;
  
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update other user fields
      const updateFields = {};
      if (firstname) updateFields.firstname = firstname;
      if (lastname) updateFields.lastname = lastname;
      if (mail) updateFields.mail = mail;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(password, salt);
      }
  
      // Update the user's data
      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
      });
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
};
