require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');
const SpotifyWebApi = require('spotify-web-api-node');

const bandsInTown = new BITAPIHandler(`${process.env.BASE_URL}`, `${process.env.BANDS_IN_TOWN_APP_ID}`);

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

router.get('/', (req, res, next) => {
    // bandsInTown
    //     .getArtistEvents('Metallica')
    //     .then(events => {
    //         res.render('events/artist.hbs', { events });
    //     })
    //     .catch(err => console.error(err));
});

router.post('/', async (req, res, next) => {
    const { artistInput } = req.body;
    const events = await bandsInTown.getArtistEvents(artistInput);
    const artistInfo = await bandsInTown.getArtistInfo(artistInput);
    const artistMBId = artistInfo.mbid;

    if (!events || events.length === 0 || events === 'undefined') {
        console.log('no events were found');
        spotifyApi
            .searchArtists(artistInput)
            .then(data => {
                const { items } = data.body.artists;
                console.log('This is the data', items);

                if (items.length < 1) {
                    console.log('No band was found');
                    res.render('index', { artistErrorMessage: 'Artist not found' });
                } else {
                    res.redirect(`/artist/search/${artistInput}`);
                }
            })
            .catch(err => {
                console.error(`Error when looking for artist`, err);
            });

        return;
    }

    res.render('events/artist.hbs', { events, artistInput, artistMBId });
});

module.exports = router;
