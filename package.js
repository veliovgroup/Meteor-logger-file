Package.describe({
  name: 'ostrio:loggerfile',
  version: '1.0.1',
  summary: 'Simply store application logs into file within ostrio:logger package',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['coffeescript', 'ostrio:logger@1.0.0'], ['client', 'server']);
  api.use('ostrio:meteor-root@1.0.3', 'server')
  api.addFiles('loggerfile.coffee', ['client', 'server']);
});

Npm.depends({
  'fs-extra': '0.26.7'
});