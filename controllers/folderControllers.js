const Q = require('q'),
      mongoose   = require('mongoose'),
      sha3_256 = require('js-sha3').sha3_256,
      fs = require('fs'),
      mkdirp = require('mkdirp'),
      rmdir = require('rmdir'),
      mv = require('mv'),
      User = require('../models/user'),
      Folder = require('../models/folder');

const folderMultiUpdate = require('../helpers/folderMultiUpdate');

var controller = {};

controller.POST_Folder = POST_Folder;
controller.GET_Folder = GET_Folder;
controller.RENAME_Folder = RENAME_Folder;
controller.DELETE_Folder = DELETE_Folder;

module.exports = controller;

function POST_Folder(req, _id) {
    var deferred = Q.defer();

    User.findById(_id, function(err, user) {
        if (err) deferred.reject(err)

        let folder = new Folder({
            name: req.name,
            user: user._id,
            parent: null,
        });

        let path = '../folders/' + sha3_256(user._id.toString());

        if(req.parent != 'null') {

            Folder.findById(req.parent, function(err, parent) {
                if (err) deferred.reject(err)

                folder.parent = parent._id
                folder.path = parent.path + '/' + folder.name;

                mkdirp(path + folder.path, function (err) {
                    if (err) deferred.reject(err)

                    if(folder.parents != null) {
                        folder.parents = parent.parents
                    }
                    folder.parents.push(parent._id)

                    folder.save(function(err, folder) {
                        if (err) deferred.reject(err)

                        deferred.resolve();
                    });
                });
            });

        } else {

            folder.path = '/' + folder.name;

            mkdirp(path + '/' + folder.name, function (err) {
                if (err) deferred.reject(err)

                folder.save(function(err, folder) {
                    if (err) deferred.reject(err)

                    deferred.resolve();
                });
            });

        }

    });

    return deferred.promise;
}

function GET_Folder(id) {
    var deferred = Q.defer();



    return deferred.promise;
}

function RENAME_Folder(newName, id, userID) {
    var deferred = Q.defer();

    Folder.findOne({ _id : id, user : userID }, function(err, folder) {
        if (err) deferred.reject(err)

        let racinePath = '../folders/' + sha3_256(folder.user.toString())

        Folder.find({ parents : folder._id }).lean().exec(function(err, childs) {
            if (err) deferred.reject(err)

            let documents = []
            let oldPath = folder.path
            let regEx = new RegExp(folder.name)
            let startPos = folder.path.lastIndexOf(folder.name)

            childs.forEach( x => {
                let halfString = x.path.substring(startPos - 1 , x.path.lenght)
                let newString = x.path.substring(startPos -1 , 0) + halfString.replace(regEx, newName)
                x.path = newString
                documents.push(x)
            })

            let newPath = folder.path.substring(startPos -1 , 0) + folder.path.substring(startPos - 1 , folder.path.lenght).replace(regEx, newName)
            folder.path = newPath
            folder.name = newName
            documents.push(folder)

            let arrayRes = []

            for(let i = 0; i < documents.length; i++)
            {
                arrayRes.push(folderMultiUpdate(documents[i]))
            }

            Promise.all(arrayRes)
                .then(res => {

                    mv(racinePath + oldPath, racinePath + newPath, function(err) {
                        if (err) deferred.reject(err)

                        deferred.resolve()
                    })

                })
                .catch(err => { deferred.reject(err) })
        });
    });

    return deferred.promise;
}

function DELETE_Folder(id, userID) {
    var deferred = Q.defer();

    Folder.findOne({ _id : id, user : userID }, function(err, folder) {
        if (err) deferred.reject(err)

        Folder.find({ parents : folder._id }).lean().exec(function(err, childs) {
            if (err) deferred.reject(err)

            let path = '../folders/' + sha3_256(folder.user.toString()) + folder.path;

            if(childs.length) {

                let foldersIds = [];
                childs.forEach( x => foldersIds.push(x._id) )
                foldersIds.push(folder._id)

                Folder.remove({ _id : { $in : foldersIds } }, function(err) {
                    if (err) deferred.reject(err)

                    rmdir(path, function (err) {
                        if (err) deferred.reject(err)

                        deferred.resolve()
                    });
                });

            } else {

                Folder.remove({ _id : folder._id }, function(err) {
                    if (err) deferred.reject(err)

                    rmdir(path, function (err) {
                        if (err) deferred.reject(err)

                        deferred.resolve()
                    });
                });

            }
        })
    });

    return deferred.promise;
}
