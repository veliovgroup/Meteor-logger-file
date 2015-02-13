Package.describe({
  name: 'ostrio:loggerfile',
  version: '0.0.4',
  summary: 'Simply store application logs into file within ostrio:logger package',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('coffeescript', ['client', 'server']);
  api.use('meteorhacks:npm@1.2.2');
  api.use('ostrio:logger@0.0.2', ['client', 'server']);
  api.addFiles('ostrio:loggerfile.coffee', ['client', 'server']);
});

Npm.depends({
  'fs-extra': '0.16.3'
});