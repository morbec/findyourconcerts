const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bandsintown_id: {
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
  },
  concerts: {
    type: [Schema.Types.ObjectId],
    ref: 'Concert'
  }
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
