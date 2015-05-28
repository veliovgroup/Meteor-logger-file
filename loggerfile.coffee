if Meteor.isServer
  fs = Npm.require "fs-extra"

Meteor.log.add "File", (level, message, data = null, userId) ->
  if Meteor.isServer

    time = new Date()
    data = null if data is undefined or data is "undefined" or !data
    data = JSON.stringify(Meteor.log.antiCircular(data)) if data

    fileName = Meteor.log.file.fileNameFormat time

    if !fs.existsSync "#{Meteor.log.file.path}/#{fileName}"
      fs.createFileSync "#{Meteor.log.file.path}/#{fileName}", 0o0750

    stream = fs.createWriteStream "#{Meteor.log.file.path}/#{fileName}", "flags": "a"
    stream.end Meteor.log.file.format time, level, message, data, userId

, () ->
  if Meteor.isServer
    Meteor.log.file =
      path: ""

    storageDir = (if (process.env.NODE_ENV is "development") then "/static/logs" else "/assets/app/logs")
    path = Meteor.rootPath + storageDir

    Meteor.log.file.path = path
    Meteor.log.file.format = (time, level, message, data, userId) ->
      month = time.getMonth() + 1
      "#{time.getDate()}-#{month}-#{time.getFullYear()} #{time.getHours()}:#{time.getMinutes()}:#{time.getSeconds()} | [#{level}] | Message: \"#{message}\" | User: #{userId} | data: #{data}\r\n"

    Meteor.log.file.fileNameFormat = (time) ->
      month = time.getMonth() + 1
      "#{time.getDate()}-#{month}-#{time.getFullYear()}.log"


    if !fs.existsSync "#{path}"
      fs.mkdirsSync "#{path}", 0o0750

, true