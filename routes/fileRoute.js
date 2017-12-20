const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      FileControllers = require('../controllers/fileControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.post('/', requireAuth, POST_File);

module.exports = router;

function POST_File(req, res, next) {
    FileControllers.POST_File(req.body, req.files, req.user._id)
        .then(function () {
            res.sendStatus(200)
        })
        .catch(function(err) {
            res.send(err)
        })
}
