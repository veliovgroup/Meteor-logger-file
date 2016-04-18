Logging: To File
========
Simply store application logs into file within [ostrio:logger](https://atmospherejs.com/ostrio/logger) package

*Whenever you log message(s) on client or sever, it goes directly to log-file on your server.*

Installation:
========
```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerfile
```

Usage
========
##### Initialization [*Isomorphic*]
`new LoggerFile(LoggerInstance, options)`
 - `LoggerInstance` {*Logger*} - from `new Logger()`
 - `options` {*Object*}
 - `options.fileNameFormat` {*Function*} - Log file name, use to adjust file creation frequency, arguments:
   - `time` {*Date*}
 - `options.format` {*Function*} - Log record format, arguments:
   - `time` {*Date*}
   - `level` {*String*} - 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO'
   - `message` {*String*}
   - `data` {*Object*}
   - `userId` {*String*} - set if user is logged in and package `accounts-base` is installed
   - Note: Do not forget `\r\n` at the end of record-line
 - `path` {*String*} - Log's storage path, absolute, or relative to NodeJS process, note: do not use '~' (path relative to user)!

Example:
```javascript
this.Log = new Logger();
var LogFile = new LoggerFile(Log, {
  fileNameFormat: function(time) {
    /* Create log-files hourly */
    return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear()) + "_" + (time.getHours()) + ".log";
  },
  format: function(time, level, message, data, userId) {
    /* Omit Date and hours from messages */
    return "[" + level + "] | " + (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
  },
  path: '/data/logs/' /* Use absolute storage path */
});
```

##### Activate and set adapter settings [*Isomorphic*]
```javascript
this.Log = new Logger();
new LoggerFile(Log, {}).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: false, /* This allows to call, but not execute on Client */
  server: true   /* Calls from client will be executed on Server */
});
```

##### Log [*Isomorphic*]
```javascript
this.Log = new Logger();
new LoggerFile(Log).enable();

/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
Log.info(message, data, userId);
Log.debug(message, data, userId);
Log.error(message, data, userId);
Log.fatal(message, data, userId);
Log.warn(message, data, userId);
Log.trace(message, data, userId);
Log._(message, data, userId); //--> Shortcut for logging without message, e.g.: simple plain log

/* Use with throw */
throw Log.error(message, data, userId);
```

##### Use multiple logger(s) with different settings:
```javascript
this.Log1 = new Logger();
this.Log2 = new Logger();

new LoggerFile(Log1).enable({
  client: false,
  server: true
});

new LoggerFile(Log2, {
  fileNameFormat: function(time) {
    return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear()) + "_" + (time.getHours()) + ".log";
  },
  format: function(time, level, message, data, userId) {
    return "[" + level + "] | " + (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
  },
  path: '/data/logs/'
}).enable({
  client: false,
  server: true
});
```