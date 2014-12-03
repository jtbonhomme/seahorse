(function(global){
  'use strict';
  var help = [
    "Usage: seahorse [options] [-f <source>]",
    "",
    "Options:",
    "  --file    -f <source> load configuration file",
    "  --help    -h          display this text",
    "  --version -v          output version",
    "  --trace   -t          add server trace              (default: no trace)",
    "  --logs    -l          activate logs                 (default: no log)",
    "  --nocors  -n          deactivate CORS configuration (default: CORS are activated)",
    "  --port    -p <port>   set port",
    "",
    "Examples:",
    "  seahorse -f config.json    // run seahorse with config.json configuration on default port 3000",
    "  seahorse -f config.json -t // run seahorse with config.json configuration and traces on default port 3000",
    "  seahorse -t -p 1234 -n     // run seahorse with no configuration and traces on port 1234 and no CORS configuration"
  ].join("\n");

  global.help = help;
})(this);
