const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      multer  = require('multer'),
      upload = multer(),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      FileControllers = require('../controllers/fileControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/:id', requireAuth, GET_File);
router.post('/:id', requireAuth, upload.single('file'), POST_File);
router.delete('/:id', requireAuth, DELETE_File);

module.exports = router;

function GET_File(req, res, next) {
    FileControllers.GET_File(req.params.id, req.user._id)
        .then(function (files) {
            res.send(files)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function POST_File(req, res, next) {
    FileControllers.POST_File(req.params.id, req.files, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

function DELETE_File(req, res, next) {
    FileControllers.DELETE_File(req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}
