(function(global){
  'use strict';

  var util      = require('util');
  var help      = require('./help').help;
  var server    = require('../vendor/seahorse').server;
  var utils     = require('../vendor/seahorse').utils;

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
  function load(source, port) {
    var config = [];

    // load config file into config object
    if (/\.json$/.test(source)) {
      //var path = process.cwd() + '/' + source;
      config   = require(source);
      server.start(config, port);
    }
    else {
      throw "source file has not a json extension";
    }
  }

  // Uses minimist parsed argv in bin/seahorse
  function run(argv) {
    // todo: handle more than one json files
    var source = argv._[0];
    var port   = argv.port || argv.p;

    if (argv.trace   || argv.t) utils._debug = true;
    if (argv.version || argv.v) return version();
    if (argv.help    || argv.h) return usage();

    return load(source, (typeof port === "number")?port:3000);
  }

  global.run = run;
  global.init = load;
}(this));
