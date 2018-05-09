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


/**
 * @api {post} /file/:_id /POST/ Upload a file
 * @apiGroup File
 * @apiParam {String} _id Folder ID (Set to 'null' if it's a root folder)
 * @apiParam {Object} file File FormData
 * @apiParamExample {json} Input
 *    {
 *      "file": new FormData ([video.mp4]),
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function POST_File(req, res, next) {
    FileControllers.POST_File(req.params.id, req.files, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {get} /file/:_id /GET/ Get all files in folder
 * @apiGroup File
 * @apiParam {String} _id Folder ID (null if it's root)
 * @apiSuccess {String} files._id File ID
 * @apiSuccess {String} files.name File name
 * @apiSuccess {String} files.user User ID
 * @apiSuccess {String} files.folder Folder ID (null if it's a root folder)
 * @apiSuccess {Number} files.size File size (in bytes)
 * @apiSuccess {String} files.type File mimeType
 * @apiSuccess {Date} files.updated_at Update's date
 * @apiSuccess {Date} files.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "_id": "5a5de2dfdf0d632814b91540",
 *      "name": "Resumé.pdf",
 *      "user": "5a5de2dfdf0d632814b91540",
 *      "folder": "7a5814dfdf0d632814b91814",
 *      "size": 48521555,
 *      "type": "application/pdf",
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }]
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function GET_Files(req, res, next) {
    FileControllers.GET_Files(req.params.id, req.user._id)
        .then(function (files) {
            res.send(files)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {get} /file/one/:_id /GET/ Get one file
 * @apiGroup File
 * @apiParam {String} _id File ID
 * @apiSuccess {String} files._id File ID
 * @apiSuccess {String} files.name File name
 * @apiSuccess {String} files.user User ID
 * @apiSuccess {String} files.folder Folder ID (null if it's a root folder)
 * @apiSuccess {Number} files.size File size (in bytes)
 * @apiSuccess {String} files.type File mimeType
 * @apiSuccess {Date} files.updated_at Update's date
 * @apiSuccess {Date} files.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5a5de2dfdf0d632814b91540",
 *      "name": "Resumé.pdf",
 *      "user": "5a5de2dfdf0d632814b91540",
 *      "folder": "7a5814dfdf0d632814b91814",
 *      "size": 48521555,
 *      "type": "application/pdf",
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
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
 * @api {put} /file/move/:_id /PUT/ Move a file
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
 * @api {put} /file/rename/:_id /PUT/ Rename a file
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
 * @api {delete} /file/:_id /DELETE/ Delete a file
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

/**
 * @api {get} /file/download/:_id /GET/ Download a file
 * @apiGroup File
 * @apiParam {String} _id File ID
 * @apiSuccess {Buffer[]} buffer Data of file as Array Buffer
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function DOWNLOAD_File(req, res, next) {
    FileControllers.DOWNLOAD_File(req.params.id, req.user._id)
        .then(function (file) {
            res.send(file)
        })
        .catch(function(err) {
            res.send(err)
        })
}
