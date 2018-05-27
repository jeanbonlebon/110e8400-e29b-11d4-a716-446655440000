const Q = require('q'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      config = require('../config/main'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      User = require('../models/user'),
      Folder = require('../models/folder'),
      File = require('../models/file');

var controller = {};

controller.GET_Shares = GET_Shares;
controller.GET_Share = GET_Share;
controller.PUT_Share = PUT_Share;

module.exports = controller;

function GET_Shares(userID) {
    var deferred = Q.defer()

    Folder.find({ public: true, user : userID }, function(err, folders) {
        if (err) deferred.reject(err)

        deferred.resolve(folders)
    })

    return deferred.promise
}

function GET_Share(_id, userID) {
    var deferred = Q.defer()

    Folder.findOne({ _id: _id,  public: true, user : userID }, function(err, folder) {
        if (err) deferred.reject(err)
        if (!folder) deferred.reject({status: 'Not Found', statusCode: 400})

        Folder.find({ parent: _id, user : userID }, function(err, folders) {
            if (err) deferred.reject(err)
    
            deferred.resolve(folders)
        })

    })

    return deferred.promise
}

function PUT_Share(_id, userID, status) {
    var deferred = Q.defer()

    let active;
    status == true ? active == false : active == true;

    Folder.findOne({ _id: _id,  public: active, user : userID }, function(err, folder) {
        if (err) deferred.reject(err)
        if (!folder) deferred.reject({status: 'Not Found', statusCode: 400})

        folder.public = status;

        folder.save(function(err) {
            deferred.resolve()
        })
    })

    return deferred.promise
}
