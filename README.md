# Logging: To File

File adapter for [logger driver](https://github.com/VeliovGroup/Meteor-logger). Store application log messages (from both *Client* and *Server*) in the file. By default log file is rotated daily, you can easily adjust it to hourly, monthly, or any other period, via `fileNameFormat`.

*Whenever you log message(s) on Client or Sever, it goes directly to a log file on your Server.*

Features:

- 🤓 Support Windows, Linux, and MacOS environments;
- 👷‍♂️ 100% tests coverage;
- 💪 Flexible log level filters;
- 👨‍💻 `userId` is automatically passed and logged, data is associated with logged-in user;
- 📟 Pass logs from *Client* to *Server*;
- 🕷 Catch all browser's errors and exceptions.

## Installation:

```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerfile
```

## ES6 Import:

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';
```

## FAQ:

- __Q__: Where to find the log file?
  - __A__: On dev stage: `/static/logs`. On prod stage: `/assets/app/logs`. Change this behavior with `options.path` (*see below*)
- __Q__: Log files are gone, why?
  - __A__: __All logs will be removed as soon as your application rebuilds or you run__ `meteor reset`. To keep your logs persistent during development use an absolute `path` outside of your project folder, e.g. `/logs` directory. Make sure selected directory is writable by node/meteor's process owner

## Usage

### Initialization [*Isomorphic*]

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
  - __Note:__ Do not forget `\r\n` at the end of record-line
- `options.path` {*String*} - Log's storage path, absolute, or relative to NodeJS process, __note:__ do not use '~' (path relative to user)

#### Example:

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';
// Initialize Logger:
const log = new Logger();
// Initialize and enable LoggerFile with default settings:
(new LoggerFile(log)).enable();
```

#### Example 2:

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';
// Initialize Logger:
const log = new Logger();

// Initialize LoggerFile:
const LogFile = new LoggerFile(log, {
  fileNameFormat(time) {
    // Create log-files hourly
    return (time.getDate()) + '-' + (time.getMonth() + 1) + '-' + (time.getFullYear()) + '_' + (time.getHours()) + '.log';
  },
  format(time, level, message, data, userId) {
    // Omit Date and hours from messages
    return '[' + level + '] | ' + (time.getMinutes()) + ':' + (time.getSeconds()) + ' | \'' + message + '\' | User: ' + userId + '\r\n';
  },
  path: '/data/logs/' // Use absolute storage path
});

// Enable LoggerFile with default settings
LogFile.enable();
```

### Activate and set adapter settings: [*Isomorphic*]

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

const log = new Logger();
(new LoggerFile(log)).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], // Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*'
  client: true, // Set to `false` to avoid Client to Server logs transfer
  server: true  // Allow logging on server
});
```

### Log message: [*Isomorphic*]

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

const log = new Logger();
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
log._(message, data, userId); // Shortcut

// Use with throw
throw log.error(message, data, userId);
```

### Catch-all Client's errors example: [*Client*]

```js
/* Store original window.onerror */
const _GlobalErrorHandler = window.onerror;

window.onerror = (msg, url, line) => {
  log.error(msg, {file: url, onLine: line});
  if (_GlobalErrorHandler) {
    _GlobalErrorHandler.apply(this, arguments);
  }
};
```

### Catch-all Server's errors example: [*Server*]

```js
const bound = Meteor.bindEnvironment((callback) => {callback();});
process.on('uncaughtException', (err) => {
  bound(() => {
    log.error('Server Crashed!', err);
    console.error(err.stack);
    process.exit(7);
  });
});
```

### Catch-all Meteor's errors example: [*Server*]

```js
// store original Meteor error
const originalMeteorDebug = Meteor._debug;
Meteor._debug = (message, stack) => {
  const error = new Error(message);
  error.stack = stack;
  log.error('Meteor Error!', error);
  return originalMeteorDebug.apply(this, arguments);
};
```

### Use multiple logger(s) with different settings:

```js
import { Logger }     from 'meteor/ostrio:logger';
import { LoggerFile } from 'meteor/ostrio:loggerfile';

const log1 = new Logger();
const log2 = new Logger();

(new LoggerFile(log1)).enable();

(new LoggerFile(log2, {
  fileNameFormat(time) {
    return (time.getDate()) + '-' + (time.getMonth() + 1) + '-' + (time.getFullYear()) + '_' + (time.getHours()) + '.log';
  },
  format(time, level, message, data, userId) {
    return '[' + level + '] | ' + (time.getMinutes()) + ':' + (time.getSeconds()) + ' | \'' + message + '\' | User: ' + userId + '\r\n';
  },
  path: '/data/logs/'
})).enable();
```

## Support this awesome package:

- Star on [GitHub](https://github.com/VeliovGroup/Meteor-logger-file)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/loggerfile)
- [Tweet](https://twitter.com/share?url=https://github.com/VeliovGroup/Meteor-logger-file&text=Store%20%23meteorjs%20log%20messages%20(from%20Client%20%26%20Server)%20in%20the%20file%20%23javascript%20%23programming%20%23webdev%20via%20%40VeliovGroup)
- Share on [Facebook](https://www.facebook.com/sharer.php?u=https://github.com/VeliovGroup/Meteor-logger-file)

## Support our open source contribution:

This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one are available for free.
