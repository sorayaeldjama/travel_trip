const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Secret key for JWT from environment variable
const secretKey = process.env.SECRET_KEY;

/**
 * Logs in users.
 * Verifies if the provided email and password match a registered user.
 * If the information is valid, generates a JWT token for the user.
 *
 * @param {Object} req - The incoming HTTP request with login information.
 * @param {Object} res - The HTTP response to send.
 * @returns {Object} - The user ID and JWT token in case of success.
 */
exports.login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(401).json({ error: "This mail doesn't exist." });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      jwt.sign(
        { user_id: user._id },
        secretKey,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json({
              user_id: user._id,
              token,
            });
          }
        }
      );
    }
    else {
      return res.status(401).json({ error: "Password incorrect." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Registers users.
 * Checks if the provided email already exists in the database.
 * If not, creates a new user and generates a JWT token for authentication.
 *
 * @param {Object} req - The incoming HTTP request with registration information.
 * @param {Object} res - The HTTP response to send.
 * @returns {Object} - The newly created user ID and JWT token in case of success.
 */
exports.register = async (req, res) => {
  const { firstname, lastname, mail, password } = req.body;

  try {
    const existingUser = await User.findOne({ mail });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = new User({ firstname, lastname, mail, password });

    const savedUser = await newUser.save();

    // Sign a JWT token with the newly created user's ID
    jwt.sign(
      { user_id: savedUser._id },
      secretKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({
            user_id: savedUser._id,
            token,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
