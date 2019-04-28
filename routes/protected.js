const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/logged', async (req, res, next) => {
  if (req.isAuthenticated()) {
    const loggedUser = await User.findById({ _id: req.user._id });
    const { artists } = loggedUser;
    const isAuthenticated = req.isAuthenticated();
    res.render('protected/logged-user', { loggedUser, artists, isAuthenticated });
    return;
  }
  res.render('error', { errorMessage: 'This is a protected route' });
});

module.exports = router;
