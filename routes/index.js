const express = require('express');
const router = express.Router();
const NB = require('nodebrainz');
const nb = new NB({ userAgent: 'my-awesome-app/0.0.1 ( http://localhost:3000 )' });

/* GET home page */
router.get('/', (req, res, next) => {
  nb.search('artist', { artist: 'tool', country: 'US' }, function(err, response) {
    console.log(response);
  });
  res.render('index');
});

module.exports = router;
