require('dotenv').config();

const express = require('express');
const router = express.Router();

// router.get('/', (req, res, next) => {
//   res.render('events/index.hbs');
// });

const profile = require('./profile');
router.use('/profile', profile);

const search = require('./search');
router.use('/search', search);



module.exports = router;
