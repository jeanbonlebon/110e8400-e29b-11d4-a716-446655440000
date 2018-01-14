const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });
const requireFacebook = passport.authenticate('facebook-token', { session: false });

router.post('/login', requireLogin, login);
router.post('/register', register);
router.post('/facebook', requireFacebook, login);

module.exports = router;

function login(req, res, next) {
    AuthControllers.login(req)
        .then(function (user) {
            res.send(user)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function register(req, res, next) {
    AuthControllers.register(req.body)
        .then(function (user) {
            res.send(user)
        })
        .catch(function(err) {
            res.send(err)
        })
}
