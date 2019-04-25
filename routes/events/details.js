require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');

const bandsInTown = new BITAPIHandler(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);

router.get('/:artistInput/:eventId', async (req, res, end) => {
    const { artistInput, eventId } = req.params;
    const event = await bandsInTown.getArtistEventsById(artistInput, eventId);
    const artistInfo = await bandsInTown.getArtistInfo(artistInput);

    const eventInfo = event[0];
    const lineupArr = eventInfo.lineup;

    let promisesArr = lineupArr.map(band => bandsInTown.getArtistInfo(band));
    let bandsArr = await Promise.all(promisesArr);
    let thumbsArr = bandsArr.map(band => {
        return [`${band.name}`, `${band.thumb_url}`];
    });

    console.log(eventInfo)
    res.render('events/details.hbs', { eventInfo, artistInfo, thumbsArr });
});

module.exports = router;
