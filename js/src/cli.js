// Generated by CoffeeScript 1.10.0
var Config, command, minimist, printCommandList;

require("./global");

lotus.File = require("./File");

lotus.Module = require("./Module");

lotus.Plugin = require("./Plugin");

minimist = require("minimist");

process.cli = true;

process.options = minimist(process.argv.slice(2));

command = process.options._[0] || "watch";

lotus.Plugin.commands.watch = function() {
  return require("./watch");
};

Config = require("./Config");

global.GlobalConfig = Config(lotus.path);

Q["try"](function() {
  if (!GlobalConfig.plugins) {
    return;
  }
  return Q.all(sync.map(GlobalConfig.plugins, function(name) {
    return Q["try"](function() {
      var plugin;
      plugin = lotus.Plugin(name);
      return plugin.load();
    }).fail(function(error) {
      log.moat(1);
      log.red("Plugin error: ");
      log.white(name);
      log.moat(0);
      log.gray.dim(error.stack, " ");
      log.moat(1);
      return process.exit();
    });
  })).then(function() {
    if (process.options._[0]) {
      return;
    }
    if (!process.options.help) {
      return;
    }
    printCommandList();
    return process.exit();
  });
}).then(function() {
  var runCommand;
  runCommand = lotus.Plugin.commands[command];
  if (runCommand === void 0) {
    printCommandList();
    log.moat(1);
    log.red("Unknown command: ");
    log.white(command);
    log.moat(1);
    process.exit();
  }
  assert(isType(runCommand, Function), {
    command: command,
    reason: "The command failed to export a Function!"
  });
  return runCommand();
}).done();

printCommandList = function() {
  var commands, i, len;
  commands = Object.keys(lotus.Plugin.commands);
  log.moat(1);
  log.green("Available commands:");
  log.plusIndent(2);
  for (i = 0, len = commands.length; i < len; i++) {
    command = commands[i];
    log.moat(1);
    log.gray.dim("lotus ");
    log.white(command);
  }
  log.popIndent();
  return log.moat(1);
};
