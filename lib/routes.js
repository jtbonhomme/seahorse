(function(){
  'use strict';
  var util      = require('util');

  var routes = {
  	config: {},

    checkConfig: function(config) {
      try
      {
        var json = JSON.stringify(config);
        if( false === (config instanceof Array) ) {
          throw "object is not an array - " + config.toString();
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
          if ((typeof element.httpResponse.body === 'undefined') && (typeof element.httpResponse.file === 'undefined')) {
            throw "["+index+"] body and file are missing in httpResponse key";
          }          
        });
      }
      catch(e)
      {
        util.log("error: input file is not a valid json config file, " + e);
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
    	return (element.httpRequest.method.toUpperCase() === req.method.toUpperCase() &&
              element.httpRequest.path  === req.params[0]);
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
              if( typeof req.query[queryKey] === 'undefined' ||
                element.httpRequest.query[queryKey].toString() !== req.query[queryKey].toString() ) {
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
          matchingResponse.httpResponse.headers.forEach(function(element, index, array) {
            res.setHeader(element.name, element.value);
          });
          if( typeof matchingResponse.httpResponse.body !== 'undefined') {
            res.send(matchingResponse.httpResponse.body, matchingResponse.httpResponse.statusCode);
          }
          else if( typeof matchingResponse.httpResponse.file !== 'undefined') {
            res.status(matchingResponse.httpResponse.statusCode)
            .sendfile(matchingResponse.httpResponse.file);
          }
        }, (typeof matchingResponse.httpResponse.delay === 'undefined')?1:matchingResponse.httpResponse.delay);
      }
      else {
        res.send("Not found", 404);
      }
    }
  };

  module.exports.routes  = routes;
})();
