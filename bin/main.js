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

  // Load a config file and start server on a given port
  function load(filename, port) {
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
    server.start(config, port);
  }

  // Uses minimist parsed argv in bin/seahorse
  function run(argv) {
    var port   = argv.port || argv.p;
    // todo: handle more than one json files
    var file   = argv.file || argv.f;
    var logs   = false;

    if (argv.nocors  || argv.n) utils._cors   = false;
    // todo: handle more than one level of verbosity -ttt or --trace 3
    if (argv.trace   || argv.t) utils._debug = true;
    // todo: output logs in a log file instead of stdout
    if (argv.logs    || argv.l) utils._logs = true;
    if (argv.version || argv.v) return version();
    if (argv.help    || argv.h) return usage();

    return load(file, (typeof port === "number")?port:3000);
  }

  global.run = run;
  global.init = load;
}(this));
