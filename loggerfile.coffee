NOOP = -> return
if Meteor.isServer
  fs = Npm.require "fs-extra"

class LoggerFile
  constructor: (@logger, @options = {}) ->
    check @logger, Match.OneOf Logger, Object
    check @options, Object

    self = @
    if Meteor.isServer
      ###
      # fileNameFormat - Log file name
      ###
      if self.options.fileNameFormat
        unless _.isFunction self.options.fileNameFormat
          throw new Meteor.Error '[LoggerFile] [options.fileNameFormat] Must be a Function!'
      else
        self.options.fileNameFormat = (time) ->
          month = "#{time.getMonth() + 1}"
          month = "0" + month if month.length is 1
          date  = "#{time.getDate()}"
          date  = "0" + date if date.length is 1
          year  = "#{time.getFullYear()}"
          year  = "0" + year if year.length is 1
          return "#{date}-#{month}-#{year}.log"

      ###
      # format - Log record format
      ###
      if self.options.format
        unless _.isFunction self.options.format
          throw new Meteor.Error '[LoggerFile] [options.format] Must be a Function!'
      else
        self.options.format = (time, level, message, data, userId) ->
          month = "#{time.getMonth() + 1}"
          month = "0" + month if month.length is 1
          date  = "#{time.getDate()}"
          date  = "0" + date if date.length is 1
          year  = "#{time.getFullYear()}"
          year  = "0" + year if year.length is 1
          hours = "#{time.getHours()}"
          hours = "0" + hours if hours.length is 1
          mins  = "#{time.getMinutes()}"
          mins  = "0" + mins if mins.length is 1
          sec   = "#{time.getSeconds()}"
          sec   = "0" + sec if sec.length is 1

          return "#{date}-#{month}-#{year} #{hours}:#{mins}:#{sec} | [#{level}] | Message: \"#{message}\" | User: #{userId} | data: #{data}\r\n"

      ###
      # path - Log's storage path
      ###
      if self.options.path
        unless _.isString self.options.path
          throw new Meteor.Error '[LoggerFile] [options.path] Must be a String!'
      else
        self.options.path = Meteor.rootPath + (if (process.env.NODE_ENV is "development") then "/static/logs" else "/assets/app/logs")

      self.options.path = self.options.path.replace /\/$/, ""

      fs.ensureDir "#{self.options.path}", (error) ->
        if error
          console.error error
          throw new Meteor.Error "[LoggerFile] [options.path] Error:", error
        fs.writeFile "#{self.options.path}/test", 'test', (error) ->
          if error
            console.error error
            throw new Meteor.Error "[LoggerFile] [options.path] #{self.options.path} is not writable!!!"
          fs.unlink "#{self.options.path}/test", NOOP

    self.logger.add 'File', (level, message, data = null, userId) ->
      if Meteor.isServer
        time = new Date()
        if data
          data = self.logger.antiCircular data
          if _.isString data.stackTrace
            data.stackTrace = data.stackTrace.split /\n|\\n|\r|\r\n/g
          data = JSON.stringify data, false, 2

        fs.appendFile "#{self.options.path}/#{self.options.fileNameFormat(time)}", self.options.format(time, level, message, data, userId), NOOP
    , NOOP
    , true

  enable: (rule = {}) ->
    check rule, Object
    rule.enable ?= true
    rule.client ?= false
    rule.server ?= true
    @logger.rule 'File', rule
    return @