Package.describe({
  name: 'ostrio:loggerfile',
  version: '0.0.5',
  summary: 'Simply store application logs into file within ostrio:logger package',
  git: 'https://github.com/VeliovGroup/Meteor-logger-file',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['coffeescript', 'ostrio:logger@0.0.4'], ['client', 'server']);
  api.addFiles('ostrio:loggerfile.coffee', ['client', 'server']);
});

Npm.depends({
  'fs-extra': '0.16.3'
});