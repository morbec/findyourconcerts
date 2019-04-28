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
  artists: [
    {
      name: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true,
        unique: true
      },
      image_url: {
        type: String
      },
      thumb_url: {
        type: String
      },
      facebook_page_url: {
        type: String
      },
      spotify_id: {
        type: String
      }
    }
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
