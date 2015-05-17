(function(global){
  'use strict';

  var util      = require('util'),
      help      = require('./help').help,
      server    = require('../vendor/seahorse').server,
      utils     = require('../vendor/seahorse').utils,
      path      = require('path');

  // Output version
  function version() {
    var pkg = require('../package.json');
    console.log(pkg.version);
  }

  // Output help.txt
  function usage() {
    console.log(help);
  }

  // gets config file from a non nomalized path
  function getConfig(filename) {
    var config = [];
    // load config file into config object
    try {
      // convert relative path in absolute
      if( path.resolve(filename)!==filename) {
        filename = path.normalize(process.cwd()+'/'+filename);
      }
      config = require(filename);
    }
    catch(e){
      util.log("[load] start with empty configuration");
    }
    return config;
  }

  // Loads a config file and start server on a given port
  function load(filename, port, options) {
    if( typeof options !== 'undefined' ) {
      utils._proxy = (typeof options.proxy  === 'boolean')?options.proxy:utils._proxy;
      utils._logs  = (typeof options.logs   === 'boolean')?options.logs:utils._logs;
      utils._debug = (typeof options.traces === 'boolean')?options.traces:utils._debug;
      utils._cors  = (typeof options.cors   === 'boolean')?options.cors :utils._cors;      
    }

    var config = getConfig(filename);
    return server.start(config, (typeof port === "number")?port:3000);
  }

  // Uses minimist parsed argv in bin/seahorse
  function run(argv) {
    var port   = argv.port || argv.p;
    // todo: handle more than one json files
    var file   = argv.file || argv.f;
    var logs   = false;

    if (argv.proxy   || argv.x) utils._proxy  = true;
    if (argv.nocors  || argv.n) utils._cors   = false;
    // todo: handle more than one level of verbosity -ttt or --trace 3
    if (argv.trace   || argv.t) utils._debug = true;
    // todo: output logs in a log file instead of stdout
    if (argv.logs    || argv.l) utils._logs = true;
    if (argv.version || argv.v) return version();
    if (argv.help    || argv.h) return usage();

    var config = getConfig(file);
    return server.start(config, (typeof port === "number")?port:3000);
  }

  global.run = run;
  global.init = load;
}(this));
