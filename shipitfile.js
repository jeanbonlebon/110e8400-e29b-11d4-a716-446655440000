module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/www/var/supfile.org/api',
      repositoryUrl: 'https://github.com/jeanbonlebon/110e8400-e29b-11d4-a716-446655440000.git',
      ignores: ['.git', 'node_modules', 'doc'],
      keepReleases: 2,
    },
    staging: {
      servers: 'dev@167.99.45.221',
    },
  })

  shipit.on('deploy:finish', function() {
      shipit.start('npm:install')
      shipit.start('doc:generate')
  })

  shipit.task('npm:install', async () => {
    await shipit.remote('cd /var/www/supfile.org/api/current && npm install')
    await shipit.remote('echo "dependencies are installed"')
  })
  shipit.task('doc:generate', async () => {
    await shipit.remote('cd /var/www/supfile.org/api/current && npm run apidoc_server')
    await shipit.remote('echo "apidoc is generated"')
  })

}
