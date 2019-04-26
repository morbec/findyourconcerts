require('dotenv').config();

const express = require('express');
const router = express.Router();
const BITAPIHandler = require('../../api/BITAPIHandler');
const MBAPIHandler = require('../../api/MBAPIHandler');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

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
    const artistData = await musicBrainz.getArtistInfoById(artistId);
    const artistInfo = await bandsInTown.getArtistInfo(artistData.name);

    const lastFMQuery = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${artistId}&api_key=f4529f53125ed399f4bee0c8d07d088b&format=json`;
    const lastFMReq = await axios.get(lastFMQuery);
    const lastFMInfo = lastFMReq.data

    const { artist } = lastFMInfo;
    artist.name = artist.name.toLowerCase();

    const { summary } = artist.bio;
    const bioIndx = summary.indexOf('<');
    artist.bio.summary = summary.substr(0, bioIndx);

    artist.tags.tag.forEach(tag => tag.name = tag.name.toLowerCase());

    const isAuthenticated = req.isAuthenticated();

    
    res.render('artist/profile.hbs', { artistData, artistInfo, artist, isAuthenticated});
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
