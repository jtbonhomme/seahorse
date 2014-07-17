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

    _get: function(req, res) {
      console.log("[_get]");
      res.send("OK\n", 200);
    },

    _post: function(req, res) {
      console.log("[_post]");
      res.send("OK\n", 200);
    },

    _put: function(req, res) {
      console.log("[_put]");
      res.send("OK\n", 200);
    },

    _delete: function(req, res) {
      console.log("[_delete]");
      res.send("OK\n", 200);
    },

    all: function(req, res) {
      console.log("[all]");
      console.log("req.method : " + JSON.stringify(req.method));
      console.log("req.url    : " + JSON.stringify(req.url));
      console.log("req.params : " + JSON.stringify(req.params));
      console.log("req.query  : " + JSON.stringify(req.query));
      console.log("req.body   : " + JSON.stringify(req.body));
      switch(req.method) {
        case "get":
        case "GET":
          this._get(req, res);
          break;
        case "post":
        case "POST":
          this._post(req, res);
          break;
        case "put":
        case "PUT":
          this._put(req, res);
          break;
        case "delete":
        case "DELETE":
          this._delete(req, res);
          break;
        default:
          res.send("[SEAHORSE] [ERROR] UNKNOWN METHOD\n", 500);
          break;
      }
    }
  };

  module.exports.routes  = routes;
})();
