Package.describe({
  name: 'ostrio:loggerfile',
  version: '2.0.4',
  summary: 'Logging: Store application\'s logs into file (Server & Client support)',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.use('ostrio:meteor-root@1.0.6', 'server');
  api.use(['ecmascript', 'check', 'ostrio:logger@2.0.6'], ['client', 'server']);
  api.use('underscore', 'server');
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['ecmascript', 'underscore', 'ostrio:logger@2.0.6', 'ostrio:loggerfile']);
  api.addFiles('loggerfile-tests.js');
});

Npm.depends({
  'fs-extra': '5.0.0'
});
