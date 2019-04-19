const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
    city: String,
    lat: Number,
    lng: Number,
    displayName: String,
    street: String,
    songkick_id: Number,
    website: String,
    phone: String,
    capacity: Number,
    description: String
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
