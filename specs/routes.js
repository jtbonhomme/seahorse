'use strict';

var should   = require('should');
var routes   = require('../lib/routes').routes;

var configOk = [
  {
    "httpRequest" : {
        "method" : "delete",
        "path" : "/help"
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
});