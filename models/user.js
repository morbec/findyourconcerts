const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'user'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
