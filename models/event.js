const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Venue = require('./venue');

const eventSchema = new Schema({
    venue_id: {
        type: Schema.Types.ObjectId,
        ref: 'Venue'
    },
    displayName: String,
    type: String,
    start: Object,
    ageRestriction: String,
    performance: [String],
    songkickId: Number,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
