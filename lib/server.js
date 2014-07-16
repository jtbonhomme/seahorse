(function(){
  'use strict';

  var fs      = require('fs');
  var express = require('express');
  var util    = require('util');
  var app     = express();
  var utils   = require('./utils');


  function start(config, port) {
    app.use(utils._allowCrossDomain);
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    util.log("start seahorse server on port " + port);

    // route for configuration consultation
    app.get("/_config", function(req, res) {
      res.send(JSON.stringify(config), 200);
    });

    app.listen(port);
  }
  module.exports.start = start;
})();
