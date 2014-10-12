(function(global){
  'use strict';

  var help      = require('./help').help;
  var server    = require('../vendor/seahorse').server;

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
  function load(source, port, logs) {
    var config = [];

    // load config file into config object
    if (/\.json$/.test(source)) {
      var path = process.cwd() + '/' + source;
      config   = require(path);
    }
    server.start(config, port, logs);
  }

  // Uses minimist parsed argv in bin/seahorse
  function run(argv) {
    // todo: handle more than one json files
    var source = argv._[0];
    var port   = argv.port || argv.p;
    var logs   = false;

    if (argv.logs    || argv.l) logs = true;
    if (argv.version || argv.v) return version();
    if (argv.help    || argv.h) return usage();

    return load(source, (typeof port === "number")?port:3000, logs);
  }

  global.run = run;
  global.init = load;
}(this));
