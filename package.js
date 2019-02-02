Package.describe({
  name: 'ostrio:loggerfile',
  version: '2.0.7',
  summary: 'Logging: Store application\'s logs into file (Server & Client support)',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use('ostrio:meteor-root@1.0.8', 'server');
  api.use(['ecmascript', 'check', 'ostrio:logger@2.0.8'], ['client', 'server']);
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use(['ecmascript', 'underscore', 'ostrio:logger', 'ostrio:loggerfile']);
  api.addFiles('loggerfile-tests.js');
});

Npm.depends({
  'fs-extra': '7.0.1'
});
