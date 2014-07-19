(function(){
  'use strict';
  var util    = require('util');

  var routes = {
  	config: {},

    // Todo: check if mandatory keys are presents
    checkConfig: function(config) {
      return true;
    },

    setConfig: function(config, app) {
      util.log("set new routes configuration");
      if(this.checkConfig(config)) {
        this.config = config;
        return true;
      }
      return false;
    },

    // Todo: mix this.config and newConfig
    updateConfig: function(config, app) {
      util.log("set new routes configuration");
      if(this.checkConfig(config)) {
        this.config = config;
        return true;
      }
      return false;
    },

    getConfig: function() {
      util.log("get new routes configuration");
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
        }, matchingResponse.httpResponse.delay);
      }
      else {
        res.send("Not found", 404);
      }
    }
  };

  module.exports.routes  = routes;
})();
