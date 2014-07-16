(function(){
  'use strict';
  var util    = require('util');

  var routes = {
  	config: {},

    setConfig: function(config, app) {
      util.log("set new routes configuration : " + JSON.stringify(config));
   	  this.config = config;
    },

    updateConfig: function(config, app) {
      util.log("set new routes configuration : " + JSON.stringify(config));
   	  this.config = config;
    },
  
    getConfig: function () {
      util.log("get new routes configuration");
  	  return this.config;
    }
  };

  module.exports.routes  = routes;
})();
