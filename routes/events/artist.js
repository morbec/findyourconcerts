require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');

const bandsInTown = new BITAPIHandler(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);

router.get('/', (req, res, next) => {
    bandsInTown
        .getArtistEvents('Metallica')
        .then(events => {
            res.render('events/artist.hbs', { events });
        })
        .catch(err => console.error(err));
});

module.exports = router;
