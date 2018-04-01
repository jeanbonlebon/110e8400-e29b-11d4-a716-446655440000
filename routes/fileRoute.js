const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      multer  = require('multer'),
      upload = multer(),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      FileControllers = require('../controllers/fileControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/:id', requireAuth, GET_Files);
router.get('/one/:id', requireAuth, GET_File);
router.get('/download/:id', requireAuth, DOWNLOAD_File);
router.post('/:id', requireAuth, upload.single('file'), POST_File);
router.put('/move/:id', requireAuth, MOVE_File);
router.put('/rename/:id', requireAuth, RENAME_File);
router.delete('/:id', requireAuth, DELETE_File);

module.exports = router;


function POST_File(req, res, next) {
    FileControllers.POST_File(req.params.id, req.files, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

function GET_Files(req, res, next) {
    FileControllers.GET_Files(req.params.id, req.user._id)
        .then(function (files) {
            res.send(files)
        })
        .catch(function(err) {
            res.send(err)
        })
}

function GET_File(req, res, next) {
    FileControllers.GET_File(req.params.id, req.user._id)
        .then(function (file) {
            res.send(file)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /file/move/:_id Move a file
 * @apiGroup File
 * @apiParam {String} _id File ID
 * @apiParam {String} folder Folder ID of new location ('null' if it's a root folder)
 * @apiParamExample {json} Input
 *    {
 *      "folder": "7a5814dfdf0d632814b91814"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function MOVE_File(req, res, next) {
    FileControllers.MOVE_File(req.body.folder, req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /file/rename/:_id Rename a file
 * @apiGroup File
 * @apiParam {String} _id File ID
 * @apiParam {String} name New name
 * @apiParamExample {json} Input
 *    {
 *      "name": "Vidéo de Présentation de SupInfo"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function RENAME_File(req, res, next) {
    FileControllers.RENAME_File(req.body.name, req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {delete} /file/:_id Delete a file
 * @apiGroup File
 * @apiParam {String} _id File ID
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function DELETE_File(req, res, next) {
    FileControllers.DELETE_File(req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

function DOWNLOAD_File(req, res, next) {
    FileControllers.DOWNLOAD_File(req.params.id, req.user._id)
        .then(function (file) {
            res.send(file)
        })
        .catch(function(err) {
            res.send(err)
        })
}
