const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('./../utils/env');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  authTokens: [String],
  createdOn: {
    type: Date,
    default: Date.now
  }
});

// This middleware computes the hash of a password whenever it has been modified.
UserSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10).then(salt => {
        let password = user.password;
        return bcrypt.hash(password, salt);
      })
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(e => {
        console.log(`Error generating password hash ${e}`);
        return Promise.reject(e);
      });
  } else {
    next();
  }
});

// generates an auth token for an user
UserSchema.methods.generateAuthToken = async function () {
  let user = this;
  const payload = {
    id: user.id
  };
  const token = jwt.sign(payload, env.JWT_SECRET_KEY);
  user.authTokens = user.authTokens.concat([token]);
  await user.save();
  return token;
}

// finds a client using their auth token
UserSchema.statics.findByToken = async function (token) {
  let User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET_KEY);
  } catch (e) {
    if (e.name == 'JsonWebTokenError') {
      return Promise.reject('Token format not valid');
    } else {
      return Promise.reject(e);
    }
  }
  return await User.findOne({
    _id: decoded.id,
    authTokens: token
  });
}

const User = mongoose.model('User', UserSchema);

module.exports = User;