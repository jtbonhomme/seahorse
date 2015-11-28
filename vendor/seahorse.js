/*! seahorse - v0.1.0 - 2015-05-17 */
(function(global){
  'use strict';

  var fs         = require('fs');
  var Throttle   = require('throttle');
  var util       = require('util');

  var utils = {
    _debug : false,
    _logs  : false,
    _cors  : true,
    _proxy : false,

    _getExtension: function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    },

    _sendfile: function(filename, res, rate) {
      var stream = fs.createReadStream(filename);
      var th = new Throttle(rate);

      stream.on('open', function() {
        if( utils._debug ) {
          util.log('[info] open ' + filename);
        }
        // automaticaly pipes readable stream to res (= writeableStream), data are then transfered
        // with a limited rate through the throttle
        stream.pipe(th).pipe(res);
      });

      stream.on('data', function(chunk) {
        if( utils._debug ) {
          util.log('[info] read a chunk  :' + chunk.length + ' bytes');
        }
      });

      stream.on('close', function(chunk) {
        if( utils._debug ) {
          util.log('closed ' + filename);
        }
      });

      stream.on('error', function(err) {
        console.log('error from reading stream ' + err.toString());
        res.end(err);
      });
    },

    _allowCrossDomain: function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Seahorse-version', '0.1.0');
  
      // intercept OPTIONS method
      if ('OPTIONS' == req.method) {
        res.send(200);
      }
      else {
        next();
      }
    }
  };

  global.utils = utils;

})(this);

(function(global, utils){
  'use strict';
  var util      = require('util'),
      path      = require('path');

  var routes = {
  	config: [],

    checkConfig: function(config) {
      try
      {
        var json = JSON.stringify(config);
        if( false === (config instanceof Array) ) {
          throw "object is not an array";
        }
        config.forEach(function(element, index, array) {
          if( (typeof element.httpRequest === 'undefined') || (typeof element.httpResponse === 'undefined')){
            throw "["+index+"] httpResponse or httpRequest missing";
          }
          if ((typeof element.httpRequest.method === 'undefined') || (typeof element.httpRequest.path === 'undefined')) {
            throw "["+index+"] method or path is missing in httpRequest key";
          }
          if (typeof element.httpResponse.statusCode === 'undefined') {
            throw "["+index+"] statusCode is missing in httpResponse key";
          }
          if ( ( element.httpRequest.method.toUpperCase() === 'GET' )  && 
               ( element.httpResponse.statusCode != 404             )  &&
               ( typeof element.httpResponse.body   === 'undefined' )  && 
               ( typeof element.httpResponse.file   === 'undefined' )  && 
               ( typeof element.httpResponse.static === 'undefined' ) ) {
            throw "["+index+"] body, file or static are missing in httpResponse key (GET "+element.httpRequest.path+")";
          }          
        });
      }
      catch(e)
      {
        if( utils._debug ) {
            util.log("[server] input file is not a valid json config file, " + e);
        }
        return false;
      }
      return true;
    },

    setConfig: function(config, app) {
      if(this.checkConfig(config)) {
        this.config = config;
        return true;
      }
      return false;
    },

    updateConfig: function(config, app) {
      var that = this;
      if(this.checkConfig(config)) {
        config.forEach(function(element1, index1, array) {
          var match = that.config.every(function(element2, index2, array){
            if( ( element2.httpRequest.path   === element1.httpRequest.path   ) && 
                ( element2.httpRequest.method === element1.httpRequest.method ) && 
                ( element2.httpRequest.query  === element1.httpRequest.query  ) ) {
              // update the current config element with these new properties
              // todo: check this method is correct (element2 will keep a reference to element1)
              element2.httpResponse = element1.httpResponse;
              return false;
            }
            else {
              return true;
            }

          });
          if( match === true ) {
            // add this element to the current config
            that.config.push(element1);
          }
        });
        return true;
      }
      return false;
    },

    getConfig: function() {
  	  return this.config;
    },

    _matchPath: function(element, req) {
      if (  element.httpRequest.method.toUpperCase() !== req.method.toUpperCase() ) {
        return false;
      }

      if (/^regexp:/.test(element.httpRequest.path)) {
        var r = new RegExp(element.httpRequest.path.split(":")[1]);
        if( r.test(req.params[0]) !== true ) {
          return false;
        }
      }
      else {
        // remove trailing slash
        if( element.httpRequest.path.replace(/\/$/, '')  !== req.params[0].replace(/\/$/, '') ) {
          return false;
        }
      }
    	return true;
    },

    all: function(req, res) {
      var matchingResponse = {};
      var that = this;
      // is there at least one element in confg that match with request ?
      var match = this.config.some(function(element, index, array) {

        if( that._matchPath(element, req) ) {
          if( typeof element.httpRequest.query !== 'undefined' ) {
            // do all query parameters match with config ?
            for (var queryKey in element.httpRequest.query ) {
              if( typeof req.query[queryKey] === 'undefined' ) {
                return false;
              }
              else if( element.httpRequest.query[queryKey].toString() !== req.query[queryKey].toString() ) {
                 return false;
              }
            }
            matchingResponse = element;
            return true;
          }
          matchingResponse = element;
          return true;
        }
        return false;
      });

      if( match ) {
        setTimeout(function() {
          // get headers
          if( typeof matchingResponse.httpResponse.headers !== 'undefined' ) {
              matchingResponse.httpResponse.headers.forEach(function(element, index, array) {
                if( element.name && element.value ) {
                  res.setHeader(element.name, element.value);              
                }
              });
          }
          // set status code
          if( typeof matchingResponse.httpResponse.statusCode !== 'undefined' ) {
            res.status(matchingResponse.httpResponse.statusCode);
          }
          else {
            // is this branch really usefull ?
            res.status(200);
          }

          if( typeof matchingResponse.httpResponse.body !== 'undefined') {
//            res.setHeader("Content-Length", matchingResponse.httpResponse.body.length);
            res.send(matchingResponse.httpResponse.body);
          }
          else {
            var filename,
                rate = matchingResponse.httpResponse.bandwidth;

            if( typeof matchingResponse.httpResponse.file !== 'undefined') {
              filename = matchingResponse.httpResponse.file;
            }
            else if( typeof matchingResponse.httpResponse.static !== 'undefined') {
              filename = matchingResponse.httpResponse.static+req.originalUrl;
            }

            if( typeof filename !== 'undefined') {
              // convert relative path in absolute
              if( path.resolve(filename)!==filename) {
                filename = path.normalize(process.cwd()+'/'+filename);
              }
              if( typeof rate !== 'undefined'){
                utils._sendfile(filename, res, rate);
              }
              else {
                res.sendfile(filename);
              }
            }
            else {
              res.send("");
            }
          }
        }, (typeof matchingResponse.httpResponse.delay === 'undefined')?1:matchingResponse.httpResponse.delay);
      }
      else {
        if( utils._debug ) {
          util.log('[warning] request not configured');
        }
        if(req.method.toUpperCase() === 'HEAD') {
          res.status(500);
          res.setHeader("Content-Length", 0);
          res.send();
        }
        else {
          var notFound="<html>Page not found</html>";
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
          res.setHeader("Content-Length", notFound.length);
          res.send(notFound, 404);
        }
      }
    }
  };

  global.routes  = routes;
})(this, this.utils);

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
