require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NB = require('nodebrainz');
const nb = new NB({ userAgent: 'my-awesome-app/0.0.1 ( http://localhost:3000 )' });
const BITAPIHander = require('../api/BITAPIHandler');
const TicketMasterAPIHandler = require('../api/TicketMasterAPIHandler');

const bandsintown = new BITAPIHander(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);
const ticketmaster = new TicketMasterAPIHandler('NoupClnMk40pzkXCMWUEYQ7oGIqXL89s');

const getIP = () => {
  axios
    .get('http://smart-ip.net/geoip-json?callback=?')
    .then(response => console.log(response))
    .catch(err => console.error('ERROR: ', err));
}; 

/* GET home page */
router.get('/', (req, res, next) => {
  // getIP();
  const isAuthenticated = req.isAuthenticated();
  res.render('index', {isAuthenticated});
});

module.exports = router;
