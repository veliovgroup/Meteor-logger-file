Package.describe({
  name: 'ostrio:loggerfile',
  version: '2.0.0',
  summary: 'Logging: Store application\'s logs into file (Server & Client support)',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.use('ostrio:meteor-root@1.0.6', 'server');
  api.use(['ecmascript', 'check', 'underscore', 'ostrio:logger@2.0.2'], ['client', 'server']);
  api.mainModule('loggerfile.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['ecmascript', 'underscore', 'ostrio:logger@2.0.2', 'ostrio:loggerfile@2.0.0']);
  api.addFiles('loggerfile-tests.js');
});

Npm.depends({
  'fs-extra': '3.0.1'
});
