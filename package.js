Package.describe({
  name: 'ostrio:loggerfile',
  version: '1.1.0',
  summary: 'Logging: Put you logs to file from server and client',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('ostrio:meteor-root@1.0.3', 'server')
  api.use(['coffeescript', 'ostrio:logger@1.1.0'], ['client', 'server']);
  api.addFiles('loggerfile.coffee', ['client', 'server']);
  api.export('LoggerFile');
});

Npm.depends({
  'fs-extra': '0.27.0'
});