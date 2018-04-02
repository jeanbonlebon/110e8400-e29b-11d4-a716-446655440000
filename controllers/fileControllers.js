const Q = require('q'),
      mongoose = require('mongoose'),
      _ = require('lodash'),
      config = require('../config/main'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      mv = require('mv'),
      User = require('../models/user'),
      File = require('../models/file'),
      Folder = require('../models/folder');

const checkMalware = require('../helpers/checkMalware'),
      getFilePath = require('../helpers/getFilePath');

var controller = {};

//30GO = 32212254720 octets

controller.GET_Files = GET_Files;
controller.GET_File = GET_File;
controller.DOWNLOAD_File = DOWNLOAD_File;
controller.POST_File = POST_File;
controller.MOVE_File = MOVE_File;
controller.RENAME_File = RENAME_File;
controller.DELETE_File = DELETE_File;

module.exports = controller;

function GET_Files(folder, _id) {
    var deferred = Q.defer()

    folder == 'null' ? folder = null : null

    File.find({ folder : folder, user : _id }, function(err, files) {
        if (err) deferred.reject(err)

        deferred.resolve(files)
    })

    return deferred.promise
}

function GET_File(file_id, _id) {
    var deferred = Q.defer()

    File.findOne({ _id : file_id, user : _id }, function(err, file) {
        if (err) deferred.reject(err)
        if (!file) deferred.reject({status: 'Not Found', statusCode: 400})

        deferred.resolve(file)
    })

    return deferred.promise
}

function DOWNLOAD_File(file_id, _id) {
    var deferred = Q.defer()

    File.findOne({ _id : file_id, user : _id }, function(err, file) {
        if (err) deferred.reject(err)
        if (!file) deferred.reject({status: 'Not Found', statusCode: 400})

        let filePath = getFilePath(file, _id)
        fs.readFile(filePath, function(err, buffer) {
            if (err) deferred.reject(err)
            if (!buffer) deferred.reject({status: 'Not Found', statusCode: 400})

            deferred.resolve(buffer)
        })
    })

    return deferred.promise
}


function POST_File(folder, dataFile, _id) {
    var deferred = Q.defer()

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        let file = new File()
        file.name = dataFile[0].originalname
        file.size = dataFile[0].size
        file.type = dataFile[0].mimetype
        file.user = user._id
        folder == 'null' ? file.folder = null : file.folder = folder

        user.space_available = user.space_available - file.size

        let extension = file.name.split(".")
        let pathTmp = './tmp/' + dataFile[0].filename
        let path = config.data_path + '/' + sha3_256(user._id.toString()) + '/' + file._id.toString() + '.' +  extension[extension.length -1]

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

function MOVE_File(toFolder, file_id, userID) {
    var deferred = Q.defer()

    toFolder == 'null' ? toFolder = null : null

    File.findById(file_id, function(err, file) {
        if (err) deferred.reject(err)
        if (!file || file.user != userID) deferred.reject({status: 'Not Found', statusCode: 400})

        file.folder = toFolder

        file.save(function (err) {
            if (err) deferred.reject(err)

            deferred.resolve()
        })
    })

    return deferred.promise
}

function RENAME_File(newName, file_id, userID) {
    var deferred = Q.defer()

    File.findById(file_id, function(err, file) {
        if (err) deferred.reject(err)
        if (!file || file.user != userID) deferred.reject({status: 'Not Found', statusCode: 400})

        file.name = newName

        file.save(function (err) {
            if (err) deferred.reject(err)

            deferred.resolve()
        })
    })

    return deferred.promise
}

function DELETE_File(file_id, _id) {
    var deferred = Q.defer()

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        File.findById(file_id, function(err, file) {
            if (err) deferred.reject(err)

            let filePath = getFilePath(file, user._id)

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
