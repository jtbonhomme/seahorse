(function(global){
  'use strict';

  var fs         = require('fs');
  var Throttle   = require('throttle');

  var utils = {
    _getExtension: function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    },

    _sendfile: function(filename, res, rate) {      
      var stream = fs.createReadStream(filename);
      var th = new Throttle(rate);

      stream.on('open', function() {
        // automaticaly pipes readable stream to res (= writeableStream), data are then transfered
        // with a limited rate through the throttle
        stream.pipe(th).pipe(res);
      });
      stream.on('error', function(err) {
        console.log('error from reading stream ' + err.toString());
        res.end(err);
      });
    },

    _allowCrossDomain: function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
