Meteor file adapter for ostrio:logger
========
Simply store application logs into file within [ostrio:logger](https://atmospherejs.com/ostrio/logger) package

Installation:
========
```shell
meteor add ostrio:loggerfile
```

Usage
========
##### Log [`Server` & `Client`]
```javascript
/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
Meteor.log.info(message, data, userId);
Meteor.log.debug(message, data, userId);
Meteor.log.error(message, data, userId);
Meteor.log.fatal(message, data, userId);
Meteor.log.warn(message, data, userId);
Meteor.log.trace(message, data, userId);
Meteor.log._(message, data, userId); //--> Shortcut for logging without message, e.g.: simple plain log
```

##### Activate and set adapter settings [`Server` & `Client`]
```javascript
Meteor.log.rule('File', 
{
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', '*' */
  client: false, /* This allows to call, but not execute on Client */
  server: true   /* Calls from client will be executed on Server */
});
```

##### Change string format [`Server`]
Default format:
```coffeescript
"#{time.getDate()}-#{time.getMonth()}-#{time.getFullYear()} #{time.getHours()}:#{time.getMinutes()}:#{time.getSeconds()} | [#{level}] | Message: \"#{message}\" | User: #{userId} | data: #{data}\r\n"
```

To change format set `Meteor.log.file.format` function
```coffeescript
if Meteor.isServer
  Meteor.log.file.format = (time, level, message, data, userId) ->
    "#{+time} [#{level}]: \"#{message}\" \r\n"
```

##### Change file name format [`Server`]
Default format:
```coffeescript
# New file will be created every day
"#{time.getDate()}-#{time.getMonth()}-#{time.getFullYear()}.log"
```

To change format set `Meteor.log.file.fileNameFormat` function
```coffeescript
if Meteor.isServer
  Meteor.log.file.fileNameFormat = (time) ->
    # New file will be created every hour
    "#{time.getHours()}_#{time.getDate()}-#{time.getMonth()}-#{time.getFullYear()}.log"
```