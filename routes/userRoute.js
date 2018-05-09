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

/**
 * @api {get} /user /GET/ Get Current User
 * @apiGroup User
 * @apiSuccess {String} user._id User ID
 * @apiSuccess {String} user.email User E-Mail
 * @apiSuccess {Object} user.profile User Profile infos
 * @apiSuccess {Number} user.space_available User Storage space available
 * @apiSuccess {Object} user.facebook User FB datas (If connect with FB)
 * @apiSuccess {Object} user.google User Google datas (If connect with Google)
 * @apiSuccess {Date} user.updated_at Update's date
 * @apiSuccess {Date} user.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "_id": "5a5de2dfdf0d632814b91540",
 *      "name": "john.doe@gmail.com",
 *      "profile": {
 *            "firstName": "John",
 *            "lastName": "Doe",
 *      },
 *      "space_available": 154523558,
 *      "facebook": {
 *            "id": "de2dfdde2dfdf0d632814f0d632814",
 *            "token": "7MEeQhKRzu7MEeQhKRzuqWlmiJdvWqWlmiJd7MEeQh7MEeQhKRzuqKRzuqWlmiJdvWvW",
 *      },
 *      "google": {
 *            "id": "2dfdfde2dfdf0d6328140d632814jj",
 *            "token": "7MEeQhKRzu7MEeQhKRzuqWlmiJdvWqWlmiJd7MEeQh7MEeQhKRzuqKRzuqWlmiJdvWvW",
 *      },
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function GET_Users(req, res, next) {
    UserControllers.GET_Users(req.user._id)
        .then(function (user) {
            res.send(user)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {put} /user /PUT/ Change E-Mail Address
 * @apiGroup User
 * @apiParam {String} email New E-Mail address
 * @apiParamExample {json} Input
 *    {
 *      "email": "newmail@gmail.com",
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 */
function PUT_Users(req, res, next) {
    UserControllers.PUT_Users(req.body, req.user._id)
        .then(function (test) {
            res.send(test)
        })
        .catch(function(err) {
            res.send(err)
        })
}
