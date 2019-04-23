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

router.post('/', (req, res, next) => {
    const { cityInput } = req.body;
    ticketmaster
        .getEventsByCityName(cityInput)
        .then(events => {
            if (!events) {
                res.render('index', { cityErrorMessage: 'City not found' });
            }
            res.render('events/city.hbs', { events, cityInput });
        })
        .catch(err => console.error(err));
});

module.exports = router;
