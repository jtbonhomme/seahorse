(function(){
  'use strict';
  var util    = require('util');

  var routes = {
  	config: {},

    setConfig: function(config, app) {
      util.log("set new routes configuration : " + JSON.stringify(config));
   	  this.config = config;
    },

    // Todo
    updateConfig: function(config, app) {
      util.log("set new routes configuration : " + JSON.stringify(config));
   	  this.config = config;
    },

    getConfig: function() {
      util.log("get new routes configuration");
  	  return this.config;
    },

    all: function(req, res) {

      // is there at least one element in confg that match with request ?
      var match = this.config.some(function(element, index, array) {
        if( element.httpRequest.method.toUpperCase() === req.method.toUpperCase() &&
            element.httpRequest.path  === req.params[0] ) {

          if( typeof element.httpRequest.query !== 'undefined' ) {

            // do all query parameters match with config ?
            for (var queryKey in element.httpRequest.query ) {
              if( typeof req.query[queryKey] === 'undefined' ||
                element.httpRequest.query[queryKey].toString() !== req.query[queryKey].toString() ) {
                 return false;
              }
            }
            return true;
          }
          return true;
        }
        return false;
      });
      res.send("Match : " + match, 200);
    }
  };

  module.exports.routes  = routes;
})();
