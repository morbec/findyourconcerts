require('dotenv').config();

const express = require('express');
const router = express.Router();

// router.get('/', (req, res, next) => {
//   res.render('events/index.hbs');
// });

const artist = require('./artist');
router.use('/artist', artist);

const city = require('./city');
router.use('/city', city);

module.exports = router;
