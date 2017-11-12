// Generated by CoffeeScript 1.12.7
var File, Type, assertType, fs, isType, path, type;

assertType = require("assertType");

isType = require("isType");

path = require("path");

Type = require("Type");

fs = require("fsx");

type = Type("Lotus_File");

type.defineValues(function(filePath, mod) {
  var ext;
  assertType(filePath, String);
  if (!path.isAbsolute(filePath)) {
    throw Error("Expected an absolute path: '" + filePath + "'");
  }
  if (mod == null) {
    mod = lotus.modules.resolve(filePath);
  }
  assertType(mod, lotus.Module);
  return {
    path: filePath,
    module: mod,
    extension: ext = path.extname(filePath),
    name: path.basename(filePath, ext),
    dir: path.relative(mod.path, path.dirname(filePath)),
    _contents: null
  };
});

type.defineGetters({
  dest: function() {
    return this.module.getDest(this.path, ".js");
  }
});

type.defineMethods({
  read: function() {
    return this._contents != null ? this._contents : this._contents = fs.readFile(this.path);
  },
  invalidate: function() {
    this._contents = null;
  }
});

type.addMixins(lotus.fileMixins);

module.exports = File = type.build();