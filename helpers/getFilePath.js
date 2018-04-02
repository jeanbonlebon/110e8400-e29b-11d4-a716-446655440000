const Q = require('q'),
      config = require('../config/main'),
      sha3_256 = require('js-sha3').sha3_256;

module.exports = function getFilePath(file, user_id) {

    let extension = file.name.split(".")
    let path = config.data_path + '/' + sha3_256(user_id.toString()) + '/' + file._id.toString() + '.' +  extension[extension.length -1]

    return path
}
