import { Meteor } from 'meteor/meteor';
import { Logger } from 'meteor/ostrio:logger';
import { check, Match } from 'meteor/check';

import fs from 'fs';
import nodePath from 'path';

const noop = () => {};

const helpers = {
  isObject(obj) {
    if (this.isArray(obj) || this.isFunction(obj)) {
      return false;
    }
    return obj === Object(obj);
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  isFunction(obj) {
    return typeof obj === 'function' || false;
  },
  isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },
  clone(obj) {
    if (!this.isObject(obj)) return obj;
    return this.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  }
};

const _helpers = ['String'];
for (let i = 0; i < _helpers.length; i++) {
  helpers[`is${_helpers[i]}`] = function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${_helpers[i]}]`;
  };
}

/**
 * @class LoggerFile
 * @summary File (FS) adapter for ostrio:logger (Logger)
 */
class LoggerFile {
  constructor(logger, options = {}) {
    check(logger, Match.OneOf(Logger, Object));
    check(options, Match.Optional(Object));

    this.logger = logger;
    this.options = options;
    this._ready = false;
    this._pending = [];

    /* fileNameFormat - Log file name */
    if (this.options.fileNameFormat) {
      if (!helpers.isFunction(this.options.fileNameFormat)) {
        throw new Meteor.Error('[LoggerFile] [options.fileNameFormat] Must be a Function!');
      }
    } else {
      this.options.fileNameFormat = (time) => {
        let month = `${time.getMonth() + 1}`;
        if (month.length === 1) {
          month = '0' + month;
        }

        let date = `${time.getDate()}`;
        if (date.length === 1) {
          date = '0' + date;
        }

        let year = `${time.getFullYear()}`;
        if (year.length === 1) {
          year = '0' + year;
        }

        return `${date}-${month}-${year}.log`;
      };
    }

    /* format - Log record format */
    if (this.options.format) {
      if(!helpers.isFunction(this.options.format)) {
        throw new Meteor.Error('[LoggerFile] [options.format] Must be a Function!');
      }
    } else {
      this.options.format = (time, level, message, _data, userId) => {
        let month = `${time.getMonth() + 1}`;
        if (month.length === 1) {
          month = '0' + month;
        }
        let date = `${time.getDate()}`;
        if (date.length === 1) {
          date = '0' + date;
        }
        let year = `${time.getFullYear()}`;
        if (year.length === 1) {
          year = '0' + year;
        }
        let hours = `${time.getHours()}`;
        if (hours.length === 1) {
          hours = '0' + hours;
        }
        let mins = `${time.getMinutes()}`;
        if (mins.length === 1) {
          mins = '0' + mins;
        }
        let sec = `${time.getSeconds()}`;
        if (sec.length === 1) {
          sec = '0' + sec;
        }

        let data = helpers.clone(_data);

        try {
          data = JSON.stringify(data);
        } catch (stringifyError) {
          // Something is off about data object
        }

        const esc = (s) => String(s).replace(/[\\"]/g, '\\$&');
        return `${date}-${month}-${year} ${hours}:${mins}:${sec} | [${level}] | Message: "${esc(message)}" | User: ${userId} | data: ${data}\n`;
      };
    }

    /* path - Log's storage path */
    if (this.options.path) {
      if (!helpers.isString(this.options.path)) {
        throw new Meteor.Error('[LoggerFile] [options.path] Must be a String!');
      }
    } else {
      this.options.path = Meteor.rootPath + ((process.env.NODE_ENV === 'development') ? `${nodePath.sep}static${nodePath.sep}logs` : `${nodePath.sep}assets${nodePath.sep}app${nodePath.sep}logs`);
    }

    const pathRegExp = new RegExp(`${nodePath.sep}$`);
    this.options.path = nodePath.resolve(this.options.path.replace(pathRegExp, ''));

    const reportError = (error, context) => {
      if (helpers.isFunction(this.options.onError)) {
        this.options.onError(error, context);
        return;
      }
      console.error(`[LoggerFile] [${context}]`, error);
    };

    const markReady = () => {
      this._ready = true;
      if (this.options.debug) {
        console.log(`[LoggerFile] path: ${this.options.path}`);
      }
      const pending = this._pending.splice(0);
      for (let i = 0; i < pending.length; i++) {
        pending[i]();
      }
    };

    const testFilePath = `${this.options.path}${nodePath.sep}test`;

    fs.mkdir(this.options.path, { recursive: true }, (mkdError) => {
      if (mkdError) {
        reportError(mkdError, 'mkdir');
        return;
      }

      fs.writeFile(testFilePath, 'test', (wfError) => {
        if (wfError) {
          reportError(wfError, 'writeTest');
          return;
        }
        fs.unlink(testFilePath, noop);
        markReady();
      });
    });

    this.logger.add('File', (level, message, data, userId) => {
      const time = new Date();

      if (data) {
        if (helpers.isString(data.stackTrace)) {
          data.stackTrace = data.stackTrace.split(/\n|\\n|\r|\r\n/g);
        }
      }

      const write = () => {
        const filePath = `${this.options.path}${nodePath.sep}${this.options.fileNameFormat(time)}`;
        const line = this.options.format(time, level, message, data, userId);
        fs.appendFile(filePath, line, (appendError) => {
          if (appendError) {
            reportError(appendError, 'appendFile');
          }
        });
      };

      if (this._ready) {
        write();
      } else {
        this._pending.push(write);
      }
    }, noop, false, false);
  }

  enable(rule = {}) {
    check(rule, {
      enable: Match.Optional(Boolean),
      client: Match.Optional(Boolean),
      server: Match.Optional(Boolean),
      filter: Match.Optional([String])
    });

    if (typeof rule.enable === 'undefined') {
      rule.enable = true;
    }
    if (typeof rule.client === 'undefined') {
      rule.client = true;
    }
    if (typeof rule.server === 'undefined') {
      rule.server = true;
    }

    this.logger.rule('File', rule);
    return this;
  }
}

export { LoggerFile };
