require('dotenv').config();

const express = require('express');
const router = express.Router();
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

router.get('/:artistInput', (req, res, next) => {
    const { artistInput } = req.params;
    
    spotifyApi
        .searchArtists(artistInput)
        .then(data => {
            const { items } = data.body.artists;
            res.render('artist/search.hbs', { items });
        })
        .catch(err => {
            console.error(`Error when looking for artist`, err);
        });
});

module.exports = router;
