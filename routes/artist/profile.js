require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');
const MBAPIHandler = require('../../api/MBAPIHandler');

const bandsInTown = new BITAPIHandler(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);
const musicBrainz = new MBAPIHandler(`${process.env.MB_BASE_URL}`);

router.get('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    const formattedId = artistId.substr(1);
    const artistData = await musicBrainz.getArtistInfoById(formattedId);
    const artistInfo = await bandsInTown.getArtistInfo(artistData.name);

    console.log('artistData', artistData, 'artistInfo', artistInfo);
    res.render('artist/profile.hbs', { artistData, artistInfo });
});

module.exports = router;
