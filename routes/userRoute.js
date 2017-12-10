const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      UserControllers = require('../controllers/userControllers.js'),
      AuthControllers = require('../controllers/authControllers.js');

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, GET_Users);
router.put('/', requireAuth, PUT_Users);

module.exports = router;


function GET_Users(req, res, next) {
    UserControllers.GET_Users()
        .then(function (users) {
            res.send(users)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function PUT_Users(req, res, next) {
    UserControllers.PUT_Users(req.body, req.user._id)
        .then(function (test) {
            res.send(test)
        })
        .catch(function(err) {
            res.send(err)
        })
}
