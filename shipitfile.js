module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/home/dev/test',
      repositoryUrl: 'https://github.com/jeanbonlebon/110e8400-e29b-11d4-a716-446655440000.git',
      ignores: ['.git', 'node_modules', 'doc'],
      keepReleases: 2,
    },
    staging: {
      servers: 'dev@167.99.45.221',
    },
  })

  shipit.on('deploy:finish',function(){
      shipit.start('npm:install')
  })

  shipit.task('npm:install', function() {
    shipit.remote('cd /var/www/supfile.org/api && npm install')
    shipit.remote('echo "dependencies are installed"')
  })
  shipit.task('generate_doc', function() {
    shipit.remote('cd /var/www/supfile.org/api && npm run apidoc_server')
    shipit.remote('echo "apidoc is generated"')
  })

}
