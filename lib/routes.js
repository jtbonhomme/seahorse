(function(global, utils){
  'use strict';
  var util      = require('util'),
      path      = require('path'),
      fs        = require('fs');

  var routes = {
  	config: [],

    getFilesizeInBytes: function(filename) {
      var stats = fs.statSync(filename);
      var fileSizeInBytes = stats.size;
      return fileSizeInBytes;
    },

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
            var filename;

            if( typeof matchingResponse.httpResponse.file !== 'undefined') {
              filename = matchingResponse.httpResponse.file;
            }
            else if( typeof matchingResponse.httpResponse.static !== 'undefined') {
              filename = matchingResponse.httpResponse.static+req.originalUrl;
            }

            if( typeof filename !== 'undefined') {
              // convert relative path in absolute
              try {
                if( path.resolve(filename)!==filename) {
                  filename = path.normalize(process.cwd()+'/'+filename);
                }
                res.setHeader("Content-Length", that.getFilesizeInBytes(filename));
                utils._sendfile(filename, res);
              }
              catch(e) {
                var notFound="<html>File '+filename+' not found</html>";
                res.setHeader("Content-Type", "text/html; charset=UTF-8");
                res.setHeader("Content-Length", notFound.length);
                res.send(notFound, 404);
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
