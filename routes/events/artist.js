require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Artist = require('../../models/artist');
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

    const isAuthenticated = req.isAuthenticated();
    const artistdb = await Artist.findOne({ bandsintown_id: artistInfo.id });
    let following = false;
    if (artistdb) following = true;
    

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
    const { artistName } = req.params;
    if (req.isAuthenticated()) {
        const artistInfo = await bandsInTown.getArtistInfo(artistName);
        User.findOne({ _id: `${req.user._id}` })
            .then(user => {
                return user;
            })
            .then(user => {
                Artist.create({
                    name: artistInfo.name,
                    bandsintown_id: artistInfo.id,
                    image_url: artistInfo.image_url,
                    thumb_url: artistInfo.thumb_url,
                    facebook_page_url: artistInfo.facebook_page_url
                }).then(newArtist => {
                    user.artists.push(newArtist._id);
                    const _id = user._id;
                    const { firstName, lastName, artists } = user;
                    User.findOneAndUpdate({ _id }, { firstName, lastName, artists })
                        .then(() => this)
                        .catch(err => err);
                });
            })
            .catch(err => {
                console.error('ERROR: ', err);
            });
        // FIXME: Should redirect back to the previous page or user list of artists

        const events = await bandsInTown.getArtistEvents(artistName);
        const artistInf = await bandsInTown.getArtistInfo(artistName);
        const artistMBId = artistInf.mbid;
        const { cityList, countryList } = events;

        if (!events || events.length === 0 || events === 'undefined') {
            res.render('index', { artistErrorMessage: 'event not found' });
            return;
        }

        const isAuthenticated = req.isAuthenticated();
        const artistdb = await Artist.findOne({ bandsintown_id: artistInf.id });
        let following = false;
        if (artistdb) following = true;

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
  const { artistName } = req.params;
    if (req.isAuthenticated()) {
        const artistInfo = await bandsInTown.getArtistInfo(artistName);

        const userdb = await User.findByIdAndUpdate({
            _id: req.user._id
        });
        const artistdb = await Artist.findOne({
            bandsintown_id: artistInfo.id
        });
        //result = words.filter(w => w !== 'elite')
        let index = userdb.artists.indexOf(artistdb._id);
        userdb.artists.splice(index);
        await userdb.save();
        await Artist.findOneAndDelete({
            _id: artistdb._id
        });
        // FIXME: Should redirect back to the previous page or user list of artists
        // res.redirect('/');
        const events = await bandsInTown.getArtistEvents(artistName);
        const artistMBId = artistInfo.mbid;
        const { cityList, countryList } = events;

        if (!events || events.length === 0 || events === 'undefined') {
            res.render('index', { artistErrorMessage: 'event not found' });
            return;
        }

        const isAuthenticated = req.isAuthenticated();
        let following = true;
        if (artistdb) following = false;

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
