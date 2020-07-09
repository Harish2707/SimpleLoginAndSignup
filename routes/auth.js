const passport = require('passport')
require('../config/google-config')
const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');

router.get('/google', passport.authenticate('google', {
        scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
)

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/login' }),
function(req, res) {
  res.redirect('/dashboard');
});

module.exports = router