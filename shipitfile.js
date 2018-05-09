module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/www/var/supfile.org/api',
      repositoryUrl: 'https://github.com/jeanbonlebon/110e8400-e29b-11d4-a716-446655440000.git',
      ignores: ['.git', 'node_modules', 'doc'],
      key: '/home/dev/.ssh/id_rsa',
      keepReleases: 2,
    },
    staging: {
      servers: 'dev@167.99.45.221',
    },
  })

  shipit.on('deploy:finish', function() {
      shipit.start('npm:install')
  })

  shipit.task('npm:install', function() {
    return shipit.remote('cd /var/www/supfile.org/api/current && npm install')
  })
  shipit.task('doc:generate', function() {
    return shipit.remote('cd /var/www/supfile.org/api/current && npm run apidoc_server')
  })

}
