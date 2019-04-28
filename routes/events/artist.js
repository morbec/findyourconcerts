require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../../models/user');
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
    res.render('index', { artistErrorMessage: 'event not found' });
    return;
  }

  let following = false;
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    const { _id } = req.user;
    const userdb = await User.findById(_id);
    following = userdb.artists.find(artist => artist.id === artistInfo.id);
  }

  res.render('events/artist.hbs', {
    events,
    artistInput,
    artistMBId,
    countryList,
    cityList,
    isAuthenticated,
    following
  });
});

router.get('/follow/:artistName', async (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    let following = false;
    const { artistName } = req.params;
    const artistInfo = await bandsInTown.getArtistInfo(artistName);
    User.findOne({ _id: `${req.user._id}` })
      .then(user => {
        if (!user.artists.find(artist => artist.id === artistInfo.id)) {
          user.artists.push(artistInfo);
          user.save(err => {
            if (err) console.error('ERROR: ', err);
            following = true;
          });
        }
      })
      .catch(err => {
        console.error('ERROR: ', err);
      });

    const events = await bandsInTown.getArtistEvents(artistName);
    const artistMBId = artistInfo.mbid;
    const { cityList, countryList } = events;

    res.render('events/artist.hbs', {
      events,
      artistName,
      artistMBId,
      countryList,
      cityList,
      isAuthenticated,
      following
    });
  }
});

router.get('/unfollow/:artistName', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { artistName } = req.params;
    const artistInfo = await bandsInTown.getArtistInfo(artistName);

    const userdb = await User.findByIdAndUpdate({
      _id: req.user._id
    });

    let following = true;
    const index = userdb.artists.reduce((acc, artist, idx) => {
      if (artist.id === artistInfo.id) acc = idx;
      return acc;
    }, -1);

    if (index >= 0) {
      userdb.artists.splice(index, 1);
      userdb.save(err => {
        if (err) console.error('ERROR: ', err);
        following = false;
      });
    }

    // used for reloading the page
    const events = await bandsInTown.getArtistEvents(artistName);
    const artistMBId = artistInfo.mbid;
    const { cityList, countryList } = events;

    // if (!events || events.length === 0 || events === 'undefined') {
    //     res.render('index', { artistErrorMessage: 'event not found' });
    //     return;
    // }

    const isAuthenticated = req.isAuthenticated();
    res.render('events/artist.hbs', {
      events,
      artistName,
      artistMBId,
      countryList,
      cityList,
      isAuthenticated,
      following
    });
  }
});

module.exports = router;
