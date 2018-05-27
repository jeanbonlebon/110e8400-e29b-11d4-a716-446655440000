const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      ShareControllers = require('../controllers/shareControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, GET_Shares);
router.get('/:id', GET_Share);
router.put('/:id', requireAuth, PUT_Share);

module.exports = router;

function GET_Shares(req, res, next) {
    ShareControllers.GET_Shares(req.user._id)
        .then(function (folders) {
            res.send(folders)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function GET_Share(req, res, next) {
    ShareControllers.GET_Share(req.params.id, req.user._id)
        .then(function (folder) {
            res.send(folder)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function PUT_Share(req, res, next) {
    ShareControllers.PUT_Share(req.params.id, req.user._id, req.body.status)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}