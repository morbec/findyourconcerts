require('dotenv').config();

const express = require('express');
const router = express.Router();
const TM = require('../../api/TicketMasterAPIHandler');

const ticketmaster = new TM(`${process.env.TICKETMASTER_CONSUMER_KEY}`);

router.get('/', (req, res, next) => {
  ticketmaster
    .getEventsByCityName('Berlin')
    .then(events => {
      res.render('events/city.hbs', { events });
    })
    .catch(err => console.error('ERROR: ', err));
});

module.exports = router;
