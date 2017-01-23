module.exports = function() {
  var command, exit, minimist, options, timeStart;
  require("./global");
  require("./index");
  timeStart = Date.now();
  exit = process.exit;
  process.exit = function() {
    log.onceFlushed(function() {
      var timeEnd;
      timeEnd = Date.now();
      log.moat(1);
      log.gray.dim("Exiting after " + (timeEnd - timeStart) + "ms...");
      log.moat(1);
      log.flush();
      return exit.call(process);
    });
  };
  log.indent = 2;
  log.moat(1);
  minimist = require("minimist");
  options = minimist(process.argv.slice(2));
  command = options._.shift();
  return lotus.initialize(options).then(function() {
    return lotus.runCommand(command, options);
  }).fail(function(error) {
    log.moat(1);
    log.red(error.stack);
    return log.moat(1);
  }).then(process.exit);
};

//# sourceMappingURL=map/cli.map
