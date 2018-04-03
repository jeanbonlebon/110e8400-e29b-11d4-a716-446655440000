const Q = require('q'),
      mongoose   = require('mongoose'),
      User = require('../models/user');

var controller = {};

controller.GET_Users = GET_Users;
controller.PUT_Users = PUT_Users;

module.exports = controller;

function GET_Users(_id) {
    var deferred = Q.defer();

    User.findOne(_id, function(err, user) {
        if (err) deferred.reject(err)

        deferred.resolve(user)
    });

    return deferred.promise;
}

function PUT_Users(body, _id) {
    var deferred = Q.defer();

    User.findById(_id, function(err, user){
        if (err) deferred.reject(err)

        if (body.email != user.mail)  user.mail = body.mail

        user.save(function(err, mdUser) {
            if (err) deferred.reject(err)

            deferred.resolve(mdUser)
        });

    });

    return deferred.promise;
}
