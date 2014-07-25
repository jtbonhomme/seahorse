'use strict';

var should   = require('should');
var api      = require('hippie');
var server   = require('../lib/server');
var routes   = require('../lib/routes').routes;

describe("[seahorse.js] ", function(){
  this.timeout(50);

  var config = [
    {
      "httpRequest" : {
          "method" : "get",
          "path" : "/foo"
      },
      "httpResponse" : {
          "statusCode" : 200,
          "body" : "{\"key\": \"value\"}",
          "headers" : [ {
              "name": "Access-Control-Allow-Headers",
              "values": ["Content-Type, Authorization"]
          },
          {
              "name": "Content-Type",
              "values": ["application/json; charset=utf-8"]
          } ],
          "delay": 1
      }
    },
    {
      "httpRequest" : {
          "method" : "post",
          "path" : "/foo"
      },
      "httpResponse" : {
          "statusCode" : 201,
          "delay": 1
      }
    },
    {
      "httpRequest" : {
          "method" : "put",
          "path" : "/foo"
      },
      "httpResponse" : {
          "statusCode" : 202,
          "delay": 1
      }
    },
    {
      "httpRequest" : {
          "method" : "delete",
          "path" : "/foo"
      },
      "httpResponse" : {
          "statusCode" : 203,
          "delay": 3000
      }
    }
  ];

  beforeEach(function(){
    routes.setConfig(config);
  });

  server.start(null, 3000);

  describe('Test get /_config server route', function() {
    it('should returns config object', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .get('/_config')
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody(config)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('Test status code', function() {
    it('should be 200 when request get /foo', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .get('/foo')
      .expectStatus(200)
      .expectHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody({"key": "value"})
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
    it('should be 201 when request post /foo', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .post('/foo')
      .expectStatus(201)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
    it('should be 202 when request put /foo', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .put('/foo')
      .expectStatus(202)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
    it('should be 203 when request delete /foo', function(done) {
      this.timeout(5000);
      api()
      .json()
      .url('http://localhost:3000/foo')
      .method('DELETE')
      .expectStatus(203)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
  });
});
