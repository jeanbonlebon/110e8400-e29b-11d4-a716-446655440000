module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/home/dev/test',
      repositoryUrl: 'https://github.com/jeanbonlebon/110e8400-e29b-11d4-a716-446655440000.git',
      ignores: ['.git', 'node_modules', 'doc'],
    },
    staging: {
      servers: 'dev@167.99.45.221',
    },
  })
}
