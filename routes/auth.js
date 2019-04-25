const express = require('express');
const bcrypt = process.platform === 'win32' ? require('bcryptjs') : require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
// const zxcvbn = require('zxcvbn');

router.get('/', (req, res, next) => {
  res.render('auth/index');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { errorMessage: req.flash('error') });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true,
    passReqToCallback: true
  })
);

router.post('/signup', (req, res, next) => {
  const { firstName, lastName, username, password } = req.body;

  if (username === '' || passport === '') {
    res.render('auth/signup', {
      errorMessage: 'You need a username and a password to register'
    });
    return;
  }

  const salt = bcrypt.genSaltSync();
  const hashPassword = bcrypt.hashSync(password, salt);

  // FIXME: When a new user sign up all artists in the db will be add to its list
  // of artists.
  User.create({ firstName, lastName, username, password: hashPassword })
    .then(() => {
      // FIXME: What to do next?
      res.redirect('/');
    })
    .catch(err => {
      // FIXME: Check error code returned by mongodb and update errorMessage with
      // the right error message
      res.render('auth/signup', {
        errorMessage: 'There is already a registered user with this username'
      });
      return;
    });
});

module.exports = router;
