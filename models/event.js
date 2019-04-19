const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({

})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;