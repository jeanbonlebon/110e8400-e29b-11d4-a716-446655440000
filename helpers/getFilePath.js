const Q = require('q'),
      env = process.env.NODE_ENV,
      config = require('../config/main'),
      sha3_256 = require('js-sha3').sha3_256;

module.exports = function getFilePath(file, user_id) {

    let rootPath = '';
    let extension = file.name.split(".");
    
    if(env == 'production') {
        rootPath = config.sshConfig.rootPath;
    } else {
        rootPath = config.data_path;
    }

    let path = rootPath + '/' + sha3_256(user_id.toString()) + '/' + file._id.toString() + '.' +  extension[extension.length -1]

    return path
}
