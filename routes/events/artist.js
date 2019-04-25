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

router.get('/', (req, res, next) => {});

router.post('/', async (req, res, next) => {
  const { artistInput } = req.body;

  const events = await bandsInTown.getArtistEvents(artistInput);
  const artistInfo = await bandsInTown.getArtistInfo(artistInput);

  const artistMBId = artistInfo.mbid;
  const { cityList, countryList } = events;


  if (!events || events.length === 0 || events === 'undefined') {
    spotifyApi
      .searchArtists(artistInput)
      .then(data => {
        const { items } = data.body.artists;

        items.length < 1
          ? res.render('index', { artistErrorMessage: 'Artist not found' })
          : res.redirect(`/artist/search/${artistInput}`);
      })
      .catch(err => {
        console.error(`Error when looking for artist`, err);
      });

    return;
  }
  res.render('events/artist.hbs', { events, artistInput, artistMBId, countryList, cityList });
});

module.exports = router;
