require('dotenv').config();

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('events/artist.hbs');
});

module.exports = router;
