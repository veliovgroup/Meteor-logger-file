Logging: To File
========
Store application log messages (from Client & Server) into the file. By default log-file created daily, you can easily adjust it to hourly or monthly or any other period, via `fileNameFormat`.

*Whenever you log message(s) on client or sever, it goes directly to log-file on your server.*

Installation:
========
```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerfile
```

Support this awesome package:
========
 - Star on [GitHub](https://github.com/VeliovGroup/Meteor-logger-file)
 - Star on [Atmosphere](https://atmospherejs.com/ostrio/loggerfile)
 - [Tweet](https://twitter.com/share?url=https://github.com/VeliovGroup/Meteor-logger-file&text=Store%20%23meteorjs%20log%20messages%20(from%20Client%20%26%20Server)%20into%20the%20file%20%23javascript%20%23programming%20%23webdev%20via%20%40VeliovGroup)
 - Share on [Facebook](https://www.facebook.com/sharer.php?u=https://github.com/VeliovGroup/Meteor-logger-file)

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
   - `level` {*String*} - 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE'
   - `message` {*String*}
   - `data` {*Object*}
   - `userId` {*String*} - set if user is logged in and package `accounts-base` is installed
   - Note: Do not forget `\r\n` at the end of record-line
 - `options.path` {*String*} - Log's storage path, absolute, or relative to NodeJS process, note: do not use '~' (path relative to user)!

Example:
```javascript
// Initialize Logger:
this.log = new Logger();

// Initialize LoggerFile and enable with default settings:
(new LoggerFile(log)).enable();
```

Example 2:
```javascript
// Initialize Logger
this.log = new Logger();

// Initialize LoggerFile:
var LogFile = new LoggerFile(log, {
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

// Enable LoggerFile with default settings
LogFile.enable();
```

##### Activate and set adapter settings: [*Isomorphic*]
```javascript
this.log = new Logger();
(new LoggerFile(log)).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: false, /* This allows to call, but not execute on Client */
  server: true   /* Calls from client will be executed on Server */
});
```

##### Log message: [*Isomorphic*]
```javascript
this.log = new Logger();
(new LoggerFile(log)).enable();

/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
log.info(message, data, userId);
log.debug(message, data, userId);
log.error(message, data, userId);
log.fatal(message, data, userId);
log.warn(message, data, userId);
log.trace(message, data, userId);
log._(message, data, userId); //--> Plain log without level

/* Use with throw */
throw log.error(message, data, userId);
```

##### Catch-all Client's errors example: [*Client*]
```javascript
/* Store original window.onerror */
var _WoE = window.onerror;

window.onerror = function(msg, url, line) {
  log.error(msg, {file: url, onLine: line});
  if (_WoE) {
    _WoE.apply(this, arguments);
  }
};
```

##### Use multiple logger(s) with different settings:
```javascript
this.log1 = new Logger();
this.log2 = new Logger();

(new LoggerFile(log1)).enable();

(new LoggerFile(log2, {
  fileNameFormat: function(time) {
    return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear()) + "_" + (time.getHours()) + ".log";
  },
  format: function(time, level, message, data, userId) {
    return "[" + level + "] | " + (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
  },
  path: '/data/logs/'
})).enable();
```