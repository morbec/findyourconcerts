const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Artist = require('../models/artist');

router.get('/logged', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const loggedUser = await User.findById({ _id: req.user._id }).populate('Artist');
    const { firstName, lastName, username, artists } = loggedUser;
    const artistObjs = [];
    if (artists) {
      for (let i = 0; i < artists.length; i++) {
        const artistdb = await Artist.findById(artists[i]);
        artistObjs.push(artistdb);
      }
    }

    const isAuthenticated = req.isAuthenticated();
    res.render('protected/logged-user', { loggedUser, artistObjs, isAuthenticated });
    return;
  }
  res.render('error', { errorMessage: 'This is a protected route' });
});

module.exports = router;
