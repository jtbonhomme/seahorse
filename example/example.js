'use strict';

var server   = require('../vendor/seahorse').server;
var api      = require('hippie');

server.start('foo.json', 1234);

api()
.json()
.base('http://localhost:1234')
.get('/_foo')
.expectStatus(200)
.expectHeader('Content-Type', 'application/json; charset=utf-8')
.expectBody({"key": "value"})
.end(function(err, res, body) {
  if (err) throw err;
  console.log("route /foo works");
});
