const mongoose = require('mongoose')
const Schema = mongoose.Schema

const artistSchema = new Schema({

})

const Artist = mongoose.model('Artist', artisttSchema);

module.exports = Artist;