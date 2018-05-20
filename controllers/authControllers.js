const env = process.env.NODE_ENV,
      jwt = require('jsonwebtoken'),
      Q = require('q'),
      crypto = require('crypto'),
      User = require('../models/user'),
      sha3_256 = require('js-sha3').sha3_256,
      mkdirp = require('mkdirp'),
      config = require('../config/main');

const sshHelper = require('../helpers/sshHelper');


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
        
        if (!validateEmail(email)) {
            return deferred.reject({ status : '422', error: 'That email address is not valid.' })
        }

        let user = new User({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName },
            space_available: 32212254720
        });

        user.save(function(err, user) {
            if (err) deferred.reject(err)

            let userInfo = setUserInfo(user);

            if(env == 'production') {

                sshHelper('add_folder', sha3_256(user._id.toString()))
                .then(function() {
                    deferred.resolve({
                        token: 'JWT ' + generateToken(userInfo),
                        user: userInfo
                    })
                })
                .catch(function(err) {
                    deferred.reject(err)
                })

            } else {

                mkdirp(config.data_path + '/' + sha3_256(user._id.toString()), function (err) {
                    if (err) deferred.reject(err)
    
                    deferred.resolve({
                      token: 'JWT ' + generateToken(userInfo),
                      user: userInfo
                    })
                })

            }
        })
    })

    return deferred.promise
}

function validateEmail(email) {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase());
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
