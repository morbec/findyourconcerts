const express = require('express');
const router = express.Router();

router.get('/secret', (req, res, next) => {
  req.isAuthenticated()
    ? res.render('protected/secret')
    : res.render('error', { errorMessage: 'This is a protected route' });
});

module.exports = router;
