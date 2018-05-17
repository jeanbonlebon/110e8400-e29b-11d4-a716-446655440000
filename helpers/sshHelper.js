const Q = require('q'),
      config = require('../config/main'),
      node_ssh = require('node-ssh');

module.exports = function sshHelper(type, data) {
    var deferred = Q.defer()
    let ssh = new node_ssh()

    ssh.connect({
        host: config.sshConfig.hostname,
        username: config.sshConfig.username,
        password: config.sshConfig.password
    })
    .then(function() {

        switch(type) {
        
        case 'add_folder':
            ssh.execCommand('mkdir -p ' + data, { cwd: config.sshConfig.rootPath })
            .then(function(result) {
                deferred.resolve()
            })
            break;
        case 'add_file':
            ssh.putFiles([{ local: data.pathTmp, remote: data.path }])
            .then(function() {
                deferred.resolve()
            }, function(err) {
                deferred.reject(err)
            })
            break;
        case 'get_file':
            ssh.getFile('./tmp/' + data.id, data.path)
            .then(function(content) {
                deferred.resolve(content)
            }, function(err) {
                deferred.reject(err)
            })
            break;
        case 'remove_file':
            ssh.execCommand('rm ' + data)
            .then(function(result) {
                deferred.resolve()
            })
        default:
            deferred.reject()
        }

    })

    return deferred.promise
};
