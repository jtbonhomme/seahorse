(function(){
  'use strict';

var express = require('express');

  function start(config, port) {
    console.log("config " + JSON.stringify(config));
    console.log("listen " + port);
  }
  module.exports.start = start;
})();
