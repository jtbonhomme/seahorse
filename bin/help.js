(function(global){
  'use strict';
  var help = [
    "Usage: seahorse <source> [options]",
    "",
    "Options:",
    "  --trace   -t          add server trace (default: off)",
    "  --help    -h          display this text",
    "  --version -v          output version",
    "  --logs    -l          activate logs",
    "  --port    -p <port>   set port",
    "",
    "Examples:",
    "  seahorse config.json    // run seahorse with config.json configuration on default port 3000",
    "  seahorse config.json -t // run seahorse with config.json configuration and traces on default port 3000",
    "  seahorse -t -p 1234     // run seahorse with no configuration and traces on port 1234"
  ].join("\n");

  global.help = help;
})(this);
