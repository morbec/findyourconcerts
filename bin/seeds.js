require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_PATH}/${DB_NAME}`);
