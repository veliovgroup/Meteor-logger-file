Package.describe({
  name: 'ostrio:loggerfile',
  version: '1.1.2',
  summary: 'Logging: Store application\'s logs into file (Server & Client support)',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('ostrio:meteor-root@1.0.3', 'server')
  api.use(['coffeescript', 'ostrio:logger@1.1.2', 'check', 'underscore'], ['client', 'server']);
  api.addFiles('loggerfile.coffee', ['client', 'server']);
  api.export('LoggerFile');
});

Npm.depends({
  'fs-extra': '0.30.0' // NOTE: this package has dropped support for Node v0.10, since v0.29.0; Brought back Node v0.10 support in v0.30.0, official support will end 2016-10-01
});