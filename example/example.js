'use strict';

var server   = require('../vendor/seahorse.min').server;
var api      = require('hippie');

var config   = require('./foo.json');

server.start(config, 1234);

api()
.json()
.base('http://localhost:1234')
.get('/foo')
.expectStatus(200)
.expectHeader('Content-Type', 'application/json; charset=utf-8')
.expectBody({"key": "value"})
.end(function(err, res, body) {
  if (err) {
    console.log("something got wrong : " + err.toString());
  }
  else{
    console.log("route get /foo works");
  }
  server.stop();
  return;
});
