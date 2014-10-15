'use strict';

describe("[server.js] ", function(){
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
                "value": "Content-Type, Authorization"
          },
          {
              "name": "Content-Type",
                "value": "application/json; charset=utf-8"
          } ],
          "delay": 1
      }
    }
  ];

  var otherConfig = [
    {
      "httpRequest" : {
          "method" : "post",
          "path" : "/bar"
      },
      "httpResponse" : {
          "statusCode" : 404,
          "delay": 1
      }
    }
  ];

  describe('Test get /_config server route', function() {
    beforeEach(function(){
      routes.setConfig(config);
    });
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

  describe('Test post /_config server route', function() {
    beforeEach(function(){
      routes.setConfig(config);
    });
    it('should returns new config when called with a correct config file', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .post('/_config')
      .send(otherConfig)
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody(otherConfig)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
    it('should returns initial config when called with an incorrect config file', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .post('/_config')
      .send(null)
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody(config)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
  });

  describe('Test put /_config server route', function() {
    beforeEach(function(){
      routes.setConfig(config);
    });
    it('should returns new config when called with a correct config file', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .put('/_config')
      .send(otherConfig)
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody(config.concat(otherConfig))
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
    it('should returns initial config when called with an incorrect config file', function(done) {
      api()
      .json()
      .base('http://localhost:3000')
      .put('/_config')
      .send(null)
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json; charset=utf-8')
      .expectBody(config)
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
    });
  });
});
