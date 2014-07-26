(function(global, utils, routes){
  'use strict';

  var fs      = require('fs');
  var express = require('express');
  var util    = require('util');
  var app     = express();
  var _server;

  var server = {
    start: function(config, port) {
      app.use(utils._allowCrossDomain);
      app.use(express.json());       // to support JSON-encoded bodies
      app.use(express.urlencoded()); // to support URL-encoded bodies
      util.log("start seahorse server on port " + port);
  
      // permanent route for current configuration reading
      app.get("/_config", function(req, res) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send(JSON.stringify(routes.getConfig()), 200);
      });
  
      // route for setting a new configuration (erase the previous one)
      app.post("/_config", function(req, res) {
        var newConfig = req.body;
        routes.setConfig(newConfig, app);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send(JSON.stringify(routes.getConfig()), 200);
      });
  
      // route for updating the current configuration (update the previous one with the new keys)
      app.put("/_config", function(req, res) {
        var newConfig = req.body;
        routes.updateConfig(newConfig, app);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
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
      _server = app.listen(port);
    },

    stop: function() {
      util.log("stop seahorse server");
      _server.close();
    }
  };

  global.server = server;
})(this, this.utils, this.routes);
