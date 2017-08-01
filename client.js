import { Logger }       from 'meteor/ostrio:logger';
import { check, Match } from 'meteor/check';
const NOOP = () => {};

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
    this.logger.add('File', NOOP, NOOP, false, false);
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
