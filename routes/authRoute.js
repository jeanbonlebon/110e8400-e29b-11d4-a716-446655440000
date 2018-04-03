const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      passportService = require('../config/passport'),
      AuthControllers = require('../controllers/authControllers.js');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });
const requireFacebook = passport.authenticate('facebook-token', { session: false });
const requireGoogle = passport.authenticate('google-token', { session: false });

router.post('/login', requireLogin, login);
router.post('/register', register);
router.post('/facebook', requireFacebook, login);
router.post('/google', requireGoogle, login);

module.exports = router;

/**
 * @api {post} /auth/login /POST/ Login
 * @apiGroup Auth
 * @apiParam {String} email E-Mail Address
 * @apiParam {String} password Password
 * @apiParamExample {json} Input
 *    {
 *      "email": "john.doe@gmail.com",
 *      "password": "************",
 *    }
 * @apiSuccess {String} token JSON Web Token
 * @apiSuccess {Object} profile User Informations
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "7MEeQhKRzu7MEeQhKRzuqWlmiJdvWqWlmiJd7MEeQh7MEeQhKRzuqKRzuqWlmiJdvWvW",
 *      "user": {
 *          "_id": 5aa67e34a1f8d1567c847462,
 *          "firstName": "John",
 *          "lastName": "Doe",
 *          "email": "john.doe@gmail.com"
 *      },
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
function login(req, res, next) {
    AuthControllers.login(req)
        .then(function (user) {
            res.send(user)
        })
        .catch(function(err) {
            res.send(err)
        })
}

/**
 * @api {post} /auth/register /POST/ Register
 * @apiGroup Auth
 * @apiParam {String} email E-Mail Address
 * @apiParam {String} password Password
 * @apiParam {String} firstName User firstname
 * @apiParam {String} lastName User lastname
 * @apiParamExample {json} Input
 *    {
 *      "email": "john.doe@gmail.com",
 *      "password": "************",
 *      "firstName": "John",
 *      "lastName": "Doe",
 *    }
 * @apiSuccess {String} token JSON Web Token
 * @apiSuccess {Object} profile User Informations
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "token": "7MEeQhKRzu7MEeQhKRzuqWlmiJdvWqWlmiJd7MEeQh7MEeQhKRzuqKRzuqWlmiJdvWvW",
 *      "user": {
 *          "_id": 5aa67e34a1f8d1567c847462,
 *          "firstName": "John",
 *          "lastName": "Doe",
 *          "email": "john.doe@gmail.com"
 *      },
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 422 That email address is already in use
 *    HTTP/1.1 500 Internal Server Error
 */
function register(req, res, next) {
    AuthControllers.register(req.body)
        .then(function (user) {
            res.send(user)
        })
        .catch(function(err) {
            res.send(err)
        })
}
