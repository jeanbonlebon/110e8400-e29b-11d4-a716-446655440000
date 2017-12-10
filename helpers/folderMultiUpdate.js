const Q = require('q'),
      Folder = require('../models/folder');

module.exports = function folderMultiUpdate(data) {
    var deferred = Q.defer();

    Folder.update({ _id : data._id }, data, function(err, folder) {
        if (err) deferred.reject(err)

        deferred.resolve(folder)
    });

    return deferred.promise;
};
