(function(){
  'use strict';

  var fs       = require('fs');
  var server   = require('./server');

  // Output version
  function version() {
    var pkg = require('../package.json');
    console.log(pkg.version);
  }

  // Output help.txt
  function help() {
    var txt = fs.readFileSync(__dirname + '/help.txt').toString();
    console.log(txt);
  }

  // Load a config file and start server on a given port
  function load(source, port) {
    var config = {};

    // load config file into config object
    if (/\.json$/.test(source)) {
      var path = process.cwd() + '/' + source;
      console.log("path:" + path);
      config   = require(path);
    }
    server.listen(config, port);
  }

  // Uses minimist parsed argv in bin/seahorse
  function run(argv) {
    // todo: handle more than one json files
    var source = argv._[0];
    var port   = argv.port || argv.p;

    if (argv.version || argv.v) return version();
    if (argv.help    || argv.h) return help();

    return load(source, (typeof port === "number")?port:3000);
  }

  module.exports.run = run;
  module.exports.init = load;
}());
