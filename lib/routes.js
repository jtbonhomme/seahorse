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
      console.log("[all]");
      console.log("req.method : " + JSON.stringify(req.method));
      console.log("req.url    : " + JSON.stringify(req.url));
      console.log("req.params : " + JSON.stringify(req.params));
      console.log("req.query  : " + JSON.stringify(req.query));
      console.log("req.body   : " + JSON.stringify(req.body));

      this.config.every(function(element, index, array) {
        console.log("ROUTE["+index+"] : " + JSON.stringify(element));
        return true;
      });
      res.send("Done", 200);
    }
  };

  module.exports.routes  = routes;
})();
