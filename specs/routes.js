'use strict';

var should   = require('should');
var routes   = require('../lib/routes').routes;

var configOk = [
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
  }
];


describe('Test checkConfig property of routes module', function() {
    describe('with a config file with is not a json', function() {
        it('should returns false', function() {
            routes.checkConfig("foo").should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no httpRequest)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpRequest;
        it('should returns false', function() {
            routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no method)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpRequest.method;
        it('should returns false', function() {
            routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no path)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpRequest.path;
        it('should returns false', function() {
        	routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no httpResponse)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpResponse;
        it('should returns false', function() {
            routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no statusCode)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpResponse.statusCode;
        it('should returns false', function() {
            routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no body nor file)', function() {
        // ugly way for duplicate object, isn't it ?
        var configKo = JSON.parse( JSON.stringify( configOk ) );
        delete configKo[0].httpResponse.body;
        it('should returns false', function() {
            routes.checkConfig(configKo).should.eql(false);
        });
    });
    describe('with a config file with a file key instead of body', function() {
        // ugly way for duplicate object, isn't it ?
        var configOk2 = JSON.parse( JSON.stringify( configOk ) );
        delete configOk2[0].httpResponse.body;
        configOk2[0].httpResponse.file = "http://www.google.com";
        it('should returns true', function() {
            routes.checkConfig(configOk2).should.eql(true);
        });
    });
    describe('with a config file with correct syntax', function() {
        it('should returns true', function() {
            routes.checkConfig(configOk).should.eql(true);
        });
    });
});