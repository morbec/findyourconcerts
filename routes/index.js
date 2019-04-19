const express = require('express');
const router = express.Router();
const NB = require('nodebrainz');
const nb = new NB({ userAgent: 'my-awesome-app/0.0.1 ( http://localhost:3000 )' });
const EventAPI = require('ticketmaster');



/* GET home page */
router.get('/', (req, res, next) => {
  EventAPI('5jigh8zGctPifG4QY4z1cEsFCIGA9Dnw').discovery.v2.event.all()
  .then(function(result) {
    // "result" is an object of Ticketmaster events information
    console.log(result.items[0].dates);
  });
  // nb.search('artist', { artist: 'tool', country: 'US' }, function(err, response) {
  //   console.log(response);
  // });
  res.render('index');
});

module.exports = router;
