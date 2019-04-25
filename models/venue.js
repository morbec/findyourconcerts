const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  offer_url: {
    type: [String]
  }
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
