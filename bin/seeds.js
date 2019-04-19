const mongoose = require('mongoose');
const Event = require('../models/event');
const Venue = require('../models/venue');

const dbName = 'find-your-concerts';
mongoose.connect(`mongodb://localhost/${dbName}`);

