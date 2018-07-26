import { Meteor }       from 'meteor/meteor';
import { Logger }       from 'meteor/ostrio:logger';
import { check, Match } from 'meteor/check';
import fs               from 'fs-extra';
const NOOP = () => {};

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
  clone(obj) {
    if (!this.isObject(obj)) return obj;
    return this.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  }
};

const _helpers = ['String'];
for (let i = 0; i < _helpers.length; i++) {
  helpers['is' + _helpers[i]] = function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + _helpers[i] + ']';
  };
}

/*
 * @class LoggerFile
 * @summary File (FS) adapter for ostrio:logger (Logger)
 */
class LoggerFile {
  constructor(logger, options = {}) {
    check(logger, Match.OneOf(Logger, Object));
    check(options, Match.Optional(Object));

    this.logger  = logger;
    this.options = options;

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

        let date  = `${time.getDate()}`;
        if (date.length === 1) {
          date  = '0' + date;
        }

        let year  = `${time.getFullYear()}`;
        if (year.length === 1) {
          year  = '0' + year;
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
      this.options.format = (time, level, message, data, userId) => {
        let month = `${time.getMonth() + 1}`;
        if (month.length === 1) {
          month = '0' + month;
        }
        let date  = `${time.getDate()}`;
        if (date.length === 1) {
          date  = '0' + date;
        }
        let year  = `${time.getFullYear()}`;
        if (year.length === 1) {
          year  = '0' + year;
        }
        let hours = `${time.getHours()}`;
        if (hours.length === 1) {
          hours = '0' + hours;
        }
        let mins  = `${time.getMinutes()}`;
        if (mins.length === 1) {
          mins  = '0' + mins;
        }
        let sec   = `${time.getSeconds()}`;
        if (sec.length === 1) {
          sec   = '0' + sec;
        }

        return `${date}-${month}-${year} ${hours}:${mins}:${sec} | [${level}] | Message: \"${message}\" | User: ${userId} | data: ${data}\r\n`;
      };
    }

    /* path - Log's storage path */
    if (this.options.path) {
      if (!helpers.isString(this.options.path)) {
        throw new Meteor.Error('[LoggerFile] [options.path] Must be a String!');
      }
    } else {
      this.options.path = Meteor.rootPath + ((process.env.NODE_ENV === 'development') ? '/static/logs' : '/assets/app/logs');
    }

    this.options.path = this.options.path.replace(/\/$/, '');

    fs.ensureDir(`${this.options.path}`, (EDError) => {
      if (EDError) {
        throw new Meteor.Error('[LoggerFile] [options.path] Error:', EDError);
      }

      fs.writeFile(`${this.options.path}/test`, 'test', (WFError) => {
        if (WFError) {
          throw new Meteor.Error(`[LoggerFile] [options.path] ${this.options.path} is not writable!!!`, WFError);
        }
        fs.unlink(`${this.options.path}/test`, NOOP);
      });
    });

    this.logger.add('File', (level, message, data = null, userId) => {
      const time = new Date();
      let _data  = null;

      if (data) {
        _data = this.logger.antiCircular(helpers.clone(data));
        if (helpers.isString(_data.stackTrace)) {
          _data.stackTrace = _data.stackTrace.split(/\n|\\n|\r|\r\n/g);
        }
        _data = JSON.stringify(_data, false, 2);
      }

      fs.appendFile(`${this.options.path}/${this.options.fileNameFormat(time)}`, this.options.format(time, level, message, _data, userId), NOOP);
    }, NOOP, false, false);
  }

  enable(rule = {}) {
    check(rule, {
      enable: Match.Optional(Boolean),
      client: Match.Optional(Boolean),
      server: Match.Optional(Boolean),
      filter: Match.Optional([String])
    });

    if (rule.enable == null) {
      rule.enable = true;
    }
    if (rule.client == null) {
      rule.client = true;
    }
    if (rule.server == null) {
      rule.server = true;
    }

    this.logger.rule('File', rule);
    return this;
  }
}

export { LoggerFile };
