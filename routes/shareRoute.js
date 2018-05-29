const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js'),
      ShareControllers = require('../controllers/shareControllers.js')

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/:id', GET_Share);
router.put('/:id', requireAuth, PUT_Share);

module.exports = router;

/**
 * @api {get} /share/:_id /GET/ Get a Shared Folder
 * @apiGroup Share
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
function GET_Share(req, res, next) {
    ShareControllers.GET_Share(req.params.id)
        .then(function (folder) {
            res.send(folder)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /share/:_id /PUT/ Change Status of Share Folder
 * @apiGroup Share
 * @apiParam {String} _id Folder ID
 * @apiParam {String} status true if shared, false is not
 * @apiParamExample {json} Input
 *    {
 *      "status": true,
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function PUT_Share(req, res, next) {
    ShareControllers.PUT_Share(req.params.id, req.user._id, req.body.status)
        .then(function () {
            res.send({status : 'OK', statusCode : 200 })
        })
        .catch(function(err) {
            res.send(err)
        })
}