const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      FolderControllers = require('../controllers/folderControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.post('/', requireAuth, POST_Folder);
router.get('/:id', requireAuth, GET_Folder);
router.get('/childs/:id', requireAuth, GET_ChildsFolder);
router.get('/download/:id', requireAuth, DOWNLOAD_Folder);
router.put('/move/:id', requireAuth, MOVE_Folder);
router.put('/rename/:id', requireAuth, RENAME_Folder);
router.delete('/:id', requireAuth, DELETE_Folder);

module.exports = router;

/**
 * @api {post} /folder /POST/ Create a folder
 * @apiGroup Folder
 * @apiParam {String} name Folder name
 * @apiParam {String} parent ID of parent folder (Set to 'null' if it's a root folder)
 * @apiParamExample {json} Input
 *    {
 *      "name": "Vidéos",
 *      "parent": "7a5814dfdf0d632814b91814"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function POST_Folder(req, res, next) {
    FolderControllers.POST_Folder(req.body, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {get} /folder/:_id /GET/ Get a folder
 * @apiGroup Folder
 * @apiParam {String} _id Folder ID
 * @apiSuccess {String} folders._id Folder ID
 * @apiSuccess {String} folders.name Folder name
 * @apiSuccess {String} folders.path Absolute path to this folder
 * @apiSuccess {String} folders.user User ID
 * @apiSuccess {String} folders.parent Immediate folder parent ID (null if it's a root folder)
 * @apiSuccess {String[]} folders.parents All parents ID of this folder (null if it's a root folder)
 * @apiSuccess {Date} folders.updated_at Update's date
 * @apiSuccess {Date} folders.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5a5de2dfdf0d632814b91540",
 *      "name": "MyFolder",
 *      "path": "/ApiFolder/MyFolder",
 *      "user": "5a5de2dfdf0d632814b91540",
 *      "parent": "7a5814dfdf0d632814b91814",
 *      "parents": ["7a5814dfdf0d632814b91814","5a5dezdfdf0d638824c91550"],
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function GET_Folder(req, res, next) {
    FolderControllers.GET_Folder(req.params.id, req.user._id)
        .then(function (folder) {
            res.send(folder)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {get} /folder/childs/:_id /GET/ Get all childs of folder
 * @apiGroup Folder
 * @apiParam {String} _id Folder ID
 * @apiSuccess {String} folders._id Folder ID
 * @apiSuccess {String} folders.name Folder name
 * @apiSuccess {String} folders.path Absolute path to this folder
 * @apiSuccess {String} folders.user User ID
 * @apiSuccess {String} folders.parent Immediate folder parent ID (null if it's a root folder)
 * @apiSuccess {String[]} folders.parents All parents ID of this folder (null if it's a root folder)
 * @apiSuccess {Date} folders.updated_at Update's date
 * @apiSuccess {Date} folders.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "_id": "5a5de2dfdf0d632814b91540",
 *      "name": "MyFolder",
 *      "path": "/ApiFolder/MyFolder",
 *      "user": "5a5de2dfdf0d632814b91540",
 *      "parent": "7a5814dfdf0d632814b91814",
 *      "parents": ["7a5814dfdf0d632814b91814","5a5dezdfdf0d638824c91550"],
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }]
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function GET_ChildsFolder(req, res, next) {
    FolderControllers.GET_ChildsFolder(req.params.id, req.user._id)
        .then(function (folders) {
            res.send(folders)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /folder/move/:_id /PUT/ Move a folder
 * @apiGroup Folder
 * @apiParam {String} _id Folder ID
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
function MOVE_Folder(req, res, next) {
    FolderControllers.MOVE_Folder(req.body.folder, req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /folder/rename/:_id /PUT/ Rename a folder
 * @apiGroup Folder
 * @apiParam {String} _id Folder ID
 * @apiParam {String} name New name
 * @apiParamExample {json} Input
 *    {
 *      "name": "4ERP"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function RENAME_Folder(req, res, next) {
    FolderControllers.RENAME_Folder(req.body.name, req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {delete} /folder/:_id /DELETE/ Delete a folder
 * @apiGroup Folder
 * @apiParam {String} _id Folder ID
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function DELETE_Folder(req, res, next) {
    FolderControllers.DELETE_Folder(req.params.id, req.user._id)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}

function DOWNLOAD_Folder(req, res, next) {
    FolderControllers.DOWNLOAD_Folder(req.params.id, req.user._id)
        .then(function (zip) {
            res.send(zip)
        })
        .catch(function(err) {
            res.send(err)
        })
}
