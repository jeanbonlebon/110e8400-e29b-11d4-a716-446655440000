const jwt = require('jsonwebtoken'),
      Q = require('q'),
      crypto = require('crypto'),
      User = require('../models/user'),
      sha3_256 = require('js-sha3').sha3_256,
      mkdirp = require('mkdirp'),
      config = require('../config/main');


var controller = {};

controller.login = login;
controller.register = register;

module.exports = controller;

function login(req) {
    var deferred = Q.defer()

    let userInfo = setUserInfo(req.user)

    deferred.resolve({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

    return deferred.promise
}

function register(req) {
    var deferred = Q.defer()

    const email = req.email;
    const firstName = req.firstName;
    const lastName = req.lastName;
    const password = req.password;

    User.findOne({ email: email }, function(err, checkUser) {
        if (err) deferred.reject(err)

        if (checkUser) {
            return deferred.reject({ status : '422', error: 'That email address is already in use.' })
        }

        let user = new User({
          email: email,
          password: password,
          profile: { firstName: firstName, lastName: lastName },
          space_available: 4026531840
        });

        user.save(function(err, user) {
            if (err) deferred.reject(err)

            let userInfo = setUserInfo(user);

            mkdirp(config.data_path + '/' + sha3_256(user._id.toString()), function (err) {
                if (err) deferred.reject(err)

                deferred.resolve({
                  token: 'JWT ' + generateToken(userInfo),
                  user: userInfo
                })
            })
        })
    })

    return deferred.promise
}


function generateToken(user) {
    return jwt.sign(user, config.secret, {
        expiresIn: 10080 // sec
    });
}

function setUserInfo(request) {
    return {
      _id: request._id,
      firstName: request.profile.firstName,
      lastName: request.profile.lastName,
      email: request.email,
    };
}
