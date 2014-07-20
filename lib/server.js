(function(){
  'use strict';

  var fs      = require('fs');
  var express = require('express');
  var util    = require('util');
  var app     = express();
  var utils   = require('./utils');
  var routes   = require('./routes').routes;

  function start(config, port) {
    app.use(utils._allowCrossDomain);
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    util.log("start seahorse server on port " + port);

    // permanent route for current configuration reading
    app.get("/_config", function(req, res) {
      res.send(JSON.stringify(routes.getConfig()), 200);
    });

    // route for setting a new configuration (erase the previous one)
    app.post("/_config", function(req, res) {
      var newConfig = req.body;
      routes.setConfig(newConfig, app);
      res.send(JSON.stringify(routes.getConfig()), 200);
    });

    // route for updating the current configuration (update the previous one with the new keys)
    app.put("/_config", function(req, res) {
      var newConfig = req.body;
      routes.updateConfig(newConfig, app);
      res.send(JSON.stringify(routes.getConfig()), 200);
    });

    // set initial config
    if( typeof config !== 'undefined') {
      routes.setConfig(config, app);
    }

    // mock routes
    app.all("*", function(req, res) {
      routes.all(req, res);
    });

    // start listening
    app.listen(port);
  }

  module.exports.start = start;
})();
