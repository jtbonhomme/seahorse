(function(global){
  'use strict';

  var fs         = require('fs');
  var Throttle   = require('throttle');
  var util       = require('util');

  var BASE_RATE = 2 * 1000 * 1000 / 8; // 2MBps = 2Mbps/8

  var utils = {
    _debug : false,
    _logs  : false,
    _cors  : true,
    _proxy : false,
    _th    : null,
    _bps   : BASE_RATE,

    _getExtension: function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    },

    _setRate: function(newrate) {
      this._th.setBps(newrate);
      this._bps = newrate;
    },

    _getRate: function() {
      return this._bps;
    },

    _sendfile: function(filename, res) {      
      var stream = fs.createReadStream(filename);
      var self = this;
      this._th = new Throttle(this._bps);
      stream.on('open', function() {
        if( utils._debug ) {
          util.log('[info] open ' + filename);
        }
        // automaticaly pipes readable stream to res (= writeableStream), data are then transfered
        // with a limited rate through the throttle
        stream.pipe(self._th).pipe(res);
      });

      stream.on('data', function(chunk) {
        if( utils._debug ) {
          util.log('[info] read a chunk  :' + chunk.length + ' bytes');
        }
      });

      stream.on('close', function(chunk) {
        self._th.reset();
        if( utils._debug ) {
          util.log('closed ' + filename);
        }
      });

      stream.on('error', function(err) {
        console.log('error from reading stream ' + err.toString());
        res.end(err);
      });
    },

    _allowCrossDomain: function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Seahorse-version', '0.1.0');
  
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
