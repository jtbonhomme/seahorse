(function(global){
  'use strict';
  var help = [
    "Usage: seahorse <source> [options]",
    "",
    "Options:",
    "  --help    -h          display this text",
    "  --version -v          output version",
    "  --logs -l             activate logs",
    "  --port    -p <port>   set port",
    "",
    "Examples:",
    "  seahorse config.json",
    "  seahorse --port 1234"
  ].join("\n");

  global.help = help;
})(this);
