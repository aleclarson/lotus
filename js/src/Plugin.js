var Factory, KeyMirror, Plugin, cache, inArray, reservedNames;

KeyMirror = require("keymirror");

inArray = require("in-array");

Factory = require("factory");

reservedNames = KeyMirror(["plugins"]);

cache = Object.create(null);

module.exports = Plugin = Factory("Plugin", {
  initArguments: function(name) {
    assertType(name, String);
    assert(reservedNames[name] === void 0, "A plugin cannot be named '" + name + "'!");
    return [name];
  },
  getFromCache: function(name) {
    return cache[name];
  },
  customValues: {
    isLoaded: {
      get: function() {
        return this._exports !== null;
      }
    }
  },
  initValues: function(name) {
    return {
      name: name,
      _loading: false,
      _exports: null,
      _initModule: null
    };
  },
  init: function(name) {
    return cache[name] = this;
  },
  load: function() {
    var context, initPlugin;
    if (this.isLoaded || this._loading) {
      return;
    }
    this._loading = true;
    initPlugin = module.optional(lotus.path + "/" + this.name, (function(_this) {
      return function(error) {
        if (error.code === "REQUIRE_FAILED") {
          error.message = "Cannot find plugin '" + _this.name + "'.";
        }
        throw error;
      };
    })(this));
    assert(isType(initPlugin, Function), {
      name: this.name,
      reason: "Plugin failed to export a Function!"
    });
    context = {
      commands: Plugin.commands,
      injectPlugin: Plugin.inject
    };
    this._exports = initPlugin.call(context);
    this._loading = false;
  },
  initModule: function(module, options) {
    var initModule;
    this.load();
    if (!this.isLoaded) {
      log.moat(1);
      log.yellow("Plugin warning: ");
      log.white(this.name);
      log.gray.dim(" for module ");
      log.cyan(module.name);
      log.moat(0);
      log.gray.dim("'plugin.isLoaded' must be true!");
      log.moat(1);
      return;
    }
    if (!this._initModule) {
      if (!isType(this._exports.initModule, Function)) {
        log.moat(1);
        log.yellow("Plugin warning: ");
        log.white(this.name);
        log.gray.dim(" for module ");
        log.cyan(module.name);
        log.moat(0);
        log.gray.dim("'plugin.initModule' must be a Function!");
        log.moat(1);
        return;
      }
      initModule = this._exports.initModule();
      if (!isType(initModule, Function)) {
        log.moat(1);
        log.yellow("Plugin warning: ");
        log.white(this.name);
        log.gray.dim(" for module ");
        log.cyan(module.name);
        log.moat(0);
        log.gray.dim("'plugin.initModule' must return a Function!");
        log.moat(1);
        return;
      }
      this._initModule = initModule;
    }
    return this._initModule(module, options);
  },
  statics: {
    commands: Object.create(null),
    injectedPlugins: [],
    inject: function(name) {
      var plugin;
      assertType(name, String);
      if (inArray(Plugin.injectedPlugins, name)) {
        return;
      }
      plugin = Plugin(name);
      plugin.load();
      Plugin.injectedPlugins.push(plugin);
    }
  }
});

//# sourceMappingURL=../../map/src/Plugin.map