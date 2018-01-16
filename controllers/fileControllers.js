const Q = require('q'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      mv = require('mv'),
      User = require('../models/user'),
      File = require('../models/file'),
      Folder = require('../models/folder');

const checkMalware = require('../helpers/checkMalware');

var controller = {};

//ClamScan -> Vérification des malware
//30GO = 32212254720 octets

controller.POST_File = POST_File;

module.exports = controller;

function POST_File(body, dataFile, _id) {
    var deferred = Q.defer()

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        let file = new File()
        file.name = dataFile[0].originalname
        file.size = dataFile[0].size
        file.type = dataFile[0].mimetype
        file.user = user._id

        user.space_available = user.space_available - file.size

        let extension = dataFile[0].originalname.split(".")
        let pathTmp = './tmp/' + dataFile[0].filename
        let path = '../folders/' + sha3_256(user._id.toString()) + '/' + file._id.toString() + '.' + extension[1]

        checkMalware(file.name, file.type, pathTmp)
        .then(res => {

            file.save(function(err) {
                if (err) deferred.reject(err)

                mv(pathTmp, path, function(err) {
                    if (err) deferred.reject(err)

                    user.save(function(err) {
                        if (err) deferred.reject(err)

                        deferred.resolve()
                    })
                })
            })

        })
        .catch(err => deferred.reject(err))

    })

    return deferred.promise
}
