const Q = require('q'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      mv = require('mv'),
      User = require('../models/user'),
      File = require('../models/file'),
      Folder = require('../models/folder');


var controller = {};

//ClamScan -> Vérification des malware
//30GO = 32212254720 octets

controller.POST_File = POST_File;

module.exports = controller;

function POST_File(body, dataFile, _id) {
    var deferred = Q.defer()

    let file = new File()
    file.name = dataFile[0].originalname
    file.size = dataFile[0].size
    file.user = _id

    let extension = dataFile[0].originalname.split(".")
    let pathTmp = './tmp/' + dataFile[0].filename
    let path = '../folders/' + sha3_256(_id.toString()) + '/' + file._id.toString() + '.' + extension[1]

    file.save(function(err) {
        if (err) deferred.reject(err)

        mv(pathTmp, path, function(err) {
            if (err) deferred.reject(err)

            deferred.resolve()
        })
    })

    return deferred.promise
}
