const Q = require('q'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      mkdirp = require('mkdirp'),
      rmdir = require('rmdir'),
      mv = require('mv'),
      User = require('../models/user'),
      Folder = require('../models/folder');


var controller = {};

controller.POST_File = POST_File;

module.exports = controller;

function POST_File(body, file, _id) {
    var deferred = Q.defer()

    console.log(body, file, _id)
    deferred.resolve()

    return deferred.promise
}
