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

controller.GET_Share = GET_Share;
controller.PUT_Share = PUT_Share;

module.exports = controller;


function GET_Share(_id) {
    var deferred = Q.defer()

    Folder.findOne({ _id: _id,  public: true }, function(err, folder) {
        if (err) deferred.reject(err)
    
        deferred.resolve(folder)
    })

    return deferred.promise
}

function PUT_Share(_id, userID, status) {
    var deferred = Q.defer()

    let active;
    status == true ? active = false : active = true;

    Folder.findOne({ _id: _id,  public: active, user : userID }, function(err, folder) {
        if (err) deferred.reject(err)

        folder.public = status;

        folder.save(function(err) {
            deferred.resolve()
        })
    })

    return deferred.promise
}
