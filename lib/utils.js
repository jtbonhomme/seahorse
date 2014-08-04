(function(global){
  'use strict';

  var fs         = require('fs');
  var Throttle   = require('throttle');

  var utils = {
    _getExtension: function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    },
  
    /* todo: 
     *   - make limit beeing used for static file download only
     *   - move this middleware in a dedicated npm package
     */
    _limit: function(root) {
      return function staticMiddleware(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) return next();
        
        var stream = fs.createReadStream(root + req.originalUrl);
        var th = new Throttle(1024*300);

        stream.on('open', function() {
          // automaticaly pipes readable stream to res (= writeableStream), data are then transfered
          // with a limited rate through the throttle
          stream.pipe(th).pipe(res);
        });
        stream.on('error', function(err) {
          console.log('error from reading stream ' + err.toString());
          res.end(err);
        });
      };
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
