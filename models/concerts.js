const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  bandsintown_id: {
    type: String,
    required: true
  },
  bandsintown_artist_id: {
    type: String,
    required: true
  },
  bandsintown_url: {
    type: String
  },
  bandsintown_venue_data: {
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
