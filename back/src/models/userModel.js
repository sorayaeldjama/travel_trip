const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstname: { 
      type: String, 
      required: true, 
      validate: {
        validator: function(v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message:props => `${props.value} is not valid. First name must contain only alphabetic characters and can't be empty.`
      }
    },
    lastname: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message:props => `${props.value} is not valid. Last name must contain only alphabetic characters and can't be empty.`
      }
    },
    mail: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(v) {
            return /\S+@\S+\.\S+/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
    }     
    },
    password: { type: String, required: true },
});

// password hashing

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// id user
userSchema.virtual("id").get(function () {
  return this._id;
});

// User toJson
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema);
  