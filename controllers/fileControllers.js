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

controller.GET_File = GET_File;
controller.POST_File = POST_File;
controller.DELETE_File = DELETE_File;

module.exports = controller;

function GET_File(folder, _id) {
    var deferred = Q.defer()

    if(folder == 'null') {
        File.find({folder : null, user : _id}, function(err, folders) {
            if (err) deferred.reject(err)

            deferred.resolve(folders)
        })
    } else {
        File.find({folder : folder, user : _id}, function(err, folders) {
            if (err) deferred.reject(err)

            deferred.resolve(folders)
        })
    }

    return deferred.promise
}

function POST_File(folder, dataFile, _id) {
    var deferred = Q.defer()
    console.log(folder, dataFile, _id)
    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        let file = new File()
        file.name = dataFile[0].originalname
        file.size = dataFile[0].size
        file.type = dataFile[0].mimetype
        file.user = user._id
        folder == 'null' ? file.folder = null : file.folder = folder

        user.space_available = user.space_available - file.size

        let extension = dataFile[0].mimetype.split("/")
        let pathTmp = './tmp/' + dataFile[0].filename
        let path = '../folders/' + sha3_256(user._id.toString()) + '/' + file._id.toString() + '.' + extension[1]

/*
        checkMalware(file.name, file.type, pathTmp)
        .then(res => {
*/
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
/*
        })
        .catch(err => deferred.reject(err))
*/
    })

    return deferred.promise
}

function DELETE_File(file_id, _id) {
    var deferred = Q.defer()

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        File.findById(file_id, function(err, file) {
            if (err) deferred.reject(err)

            let extension = file.type.split("/")
            let path = '../folders/' + sha3_256(user._id.toString()) + '/' + file._id.toString() + '.' + extension[1]

            fs.unlink(path, function(err){
                  if (err) deferred.reject(err)

                  File.remove({ _id : file._id }, function(err) {
                      if (err) deferred.reject(err)

                      deferred.resolve()
                  })
             })
        })
    })

    return deferred.promise
}
