Package.describe({
  name: 'ostrio:loggerfile',
  version: '2.1.0',
  summary: 'Logging: Store application\'s logs into file (Server & Client support)',
  git: 'https://github.com/veliovgroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['2.14', '2.15', '2.16', '3.2', '3.3.1', '3.4']);
  api.use('ostrio:meteor-root@1.1.1', 'server');
  api.use(['ecmascript', 'check', 'ostrio:logger'], ['client', 'server']);
  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use(['ecmascript', 'ostrio:logger', 'ostrio:loggerfile']);
  api.addFiles('loggerfile-tests.js');
});
