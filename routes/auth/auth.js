const express = require('express');
const bcrypt = process.platform === 'win32' ? require('bcryptjs') : require('bcrypt');
const User = require('../../models/user');
const router = express.Router();
const passport = require('passport');
// const zxcvbn = require('zxcvbn');

router.get('/', (req, res, next) => {
  res.render('auth/index');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
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
    failureRedirect: 'auth/login',
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

  User.create({ firstName, lastName, username, password: hashPassword })
    .then(() => {
      // FIXME: What to do next?
      res.redirect('/');
    })
    .catch(err => {
      res.render('auth/signup', {
        errorMessage: 'There is already a registered user with this username'
      });
      return;
    });
});

module.exports = router;
