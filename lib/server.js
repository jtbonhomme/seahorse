(function(global, utils, routes){
  'use strict';

  var express = require('express');
  var morgan  = require('morgan');
  var util    = require('util');
  var proxy  = require('express-http-proxy');

  var app     = express();

  var server = {
    _server: null,

    start: function(config, port) {
      if( utils._cors ) app.use(utils._allowCrossDomain);
      app.use(express.json());       // to support JSON-encoded bodies
      app.use(express.urlencoded()); // to support URL-encoded bodies
      if( utils._logs ) app.use(morgan('combined'));
      // http://127.0.0.1:3000/proxy?originalUrl=http://webapp.local/operator
      // -> host = webapp.local
      // -> path = /operator
      if( utils._proxy ) app.use('/proxy', proxy( function(req){
        var url = require('url');
        var host = url.parse(req.url.split('originalUrl=')[1]).host;
//        return (host?host:url.parse(req.headers.referer).host);
        return (host?host:'192.168.1.6');
      },{
        forwardPath: function(req, res) {
          var url = require('url');
          return url.parse(url.parse(req.url).query.split('originalUrl=')[1]).path;
        },
        decorateRequest: function(req) {
          console.log("[proxy] " + req.method + " - " + req.hostname + " - " + req.path);
          return req;
        }
      }));

      util.log("[server] start seahorse server on port " + port + (utils._logs?" with logs":"") + (utils._proxy?" with proxy activated":"")+ (utils._cors?" (CORS are on)":" (CORS are off)") );
      var sseClients = [];

      app.get("/stream", function(req, res) {
        req.socket.setTimeout(Number.MAX_VALUE);
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        // todo, do not add same client multiple times
        sseClients.push(res);
        util.log("[SSE] new client registered");
        res.write('\n');
      });

      app.post('/_rate/:bps', function(req, res) {
        utils._setRate(req.params.bps);
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send(JSON.stringify({bps: utils._getRate()}));
      });

      app.get('/_rate', function(req, res) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.send(JSON.stringify({bps: utils._getRate()}), 200);
      });

      app.post('/stream/:event_name', function(req, res) {
        var data = "";
        try {
          data = JSON.stringify(req.body);
        }
        catch(e) {
          data = "ERROR";
        }
        var id   = (new Date()).toLocaleTimeString();

        sseClients.forEach(function(element, index, array) {
          element.write('id: ' + id + '\n');
          element.write("event: " + req.params.event_name + '\n');
          // extra newline is not an error
          element.write("data: " + data + '\n\n');
        });
        res.send(200);
      });

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
        res.send(JSON.stringify(routes.getConfig()));
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
        if( utils._debug ) {
          util.log('[request] ' + req.method + ' ' + req.originalUrl + '\t('+ ((typeof req.headers['user-agent'] !== 'undefined')?req.headers['user-agent']:"unknown") +')');
          util.log('[request] [headers] ' + JSON.stringify(req.headers));
        }
        routes.all(req, res);
      });
  
      var self = this;
      process.on( "SIGINT", function() {
        self.stop();
      } );

      // start listening
      this._server = app.listen(port);
    },

    stop: function() {
      util.log("[server] stop seahorse server");
      // todo: ask confirmation
      if( this._server !== null ) {
        this._server.close();      
      }
      process.exit();
    }
  };

  global.server = server;
})(this, this.utils, this.routes);
