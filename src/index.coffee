
define = require "define"

exports = require "../../../lotus-require"

define exports, ->
  @options = configurable: no, writable: no
  @
    log: lazy: -> require "lotus-log"
    Module: require "./module"
    File: require "./file"

define module, ->
  @options = configurable: no, writable: no
  @ { exports }
