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

var configKo1 = [
  {
    "httpRequest" : {
        "method" : "get"
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

var configKo2 = [
  {
    "httpRequest" : {
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
    describe('with a config file with correct syntax', function() {
        it('should returns true', function() {
        	routes.checkConfig(configOk).should.eql(true);
        });
    });
    describe('with a config file with an incorrect syntax (no path)', function() {
        it('should returns false', function() {
        	routes.checkConfig(configKo1).should.eql(false);
        });
    });
    describe('with a config file with an incorrect syntax (no path)', function() {
        it('should returns false', function() {
        	routes.checkConfig(configKo2).should.eql(false);
        });
    });
});