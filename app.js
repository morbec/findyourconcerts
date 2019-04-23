require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
// User Authentication + Session
const User = require('./models/user');
const session = require('express-session');
const bcrypt = process.platform === 'win32' ? require('bcryptjs') : require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

// Fix the DeprecationWarning: collection.ensureIndex is deprecated.
// Use createIndexes instead.
mongoose.set('useCreateIndex', true);

mongoose
  .connect(`mongodb://${process.env.DB_PATH}/${process.env.DB_NAME}`, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Authentication + Session
app.use(
  session({
    secret: '666',
    resave: false,
    saveUninitialized: false
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  User.findOne({ _id })
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username })
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          done(null, false, { message: 'Wrong credentials' });
        }
        // success
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// End of Authentication + Session

// Express View engine setup

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

hbs.registerPartials(__dirname + '/views/events/partials');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
app.use('/', index);

const events = require('./routes/events');
app.use('/events', events);

const auth = require('./routes/auth/auth');
app.use('/auth', auth);
module.exports = app;
