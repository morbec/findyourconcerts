require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');
const MBAPIHandler = require('../../api/MBAPIHandler');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: `${process.env.SPOTIFY_CLIENT_ID}`,
    clientSecret: `${process.env.SPOTIFY_CLIENT_SECRET}`,
    redirectUri: 'http://localhost:3000/'
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.error('Something went wrong when retrieving an access token', error);
    });

const bandsInTown = new BITAPIHandler(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);
const musicBrainz = new MBAPIHandler(`${process.env.MB_BASE_URL}`);

router.get('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    const formattedId = artistId.substr(1);
    const artistData = await musicBrainz.getArtistInfoById(formattedId);
    const artistInfo = await bandsInTown.getArtistInfo(artistData.name);

    res.render('artist/profile.hbs', { artistData, artistInfo });
});

router.get('/:artistId/spot', (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi
        .getArtist(`${artistId}`)
        .then(data => {
            const { body } = data;
            res.render('artist/spotProfile.hbs', body);
        })
        .catch(err => {
            console.error(`Error when looking for artist`, err);
        });
});

module.exports = router;
