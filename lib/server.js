(function(global, utils, routes){
  'use strict';

  var express = require('express');
  var morgan  = require('morgan');
  var util    = require('util');
  var app     = express();

  var server = {
    _server: null,

    start: function(config, port, logs) {
      app.use(utils._allowCrossDomain);
      if( logs ) app.use(morgan('combined'));

      /* todo :
       *   - make limit path and root directory beeing configurable through seahorse rest api
       */ 
      app.use('/example', utils._limit('/Users/jbonhomm/Documents/Developpements/seahorse'));
      app.use(express.json());       // to support JSON-encoded bodies
      app.use(express.urlencoded()); // to support URL-encoded bodies
      util.log("start seahorse server on port" + (logs?" with logs ":" ") + port);
  
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
      else {
        throw "initial config is undefined";
      }
  
      // mock routes
      app.all("*", function(req, res) {
        routes.all(req, res);
      });
  
      // start listening
      this._server = app.listen(port);
    },

    stop: function() {
      if( this._server !== null ) {
        util.log("stop seahorse server");
        this._server.close();      
      }
    }
  };

  global.server = server;
})(this, this.utils, this.routes);
