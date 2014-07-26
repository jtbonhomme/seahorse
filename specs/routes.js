'use strict';

var should   = require('should');
var routes   = this.routes;

describe("[routes.js] ", function(){

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

    var updateOkSame = [
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


    var updateOkDifferent = [
      {
        "httpRequest" : {
            "method" : "post",
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


    describe('Test checkConfig method of routes module', function() {
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

    describe('Test setConfig method of routes module', function() {
        describe('with an incorrect config file', function() {
            it('should returns false', function(done) {
                routes.config = {};
                routes.setConfig("foo").should.eql(false);
                done();
            });
            it('should not modify config property', function(done) {
                routes.config.should.be.empty;
                done();
            });
        });
        describe('with an correct config file', function() {
            it('should returns true', function(done) {
                routes.config = {};
                routes.setConfig(configOk).should.eql(true);
                done();
            });
            it('should modify config property', function(done) {
                routes.config.length.should.eql(1);
                routes.config[0].should.have.properties('httpRequest', 'httpResponse');
                routes.config[0].httpRequest.should.have.properties('method', 'path');
                routes.config[0].httpResponse.should.have.properties('statusCode', 'body', 'headers', 'delay');
                done();
            });        
        });
    });

    describe('Test getConfig method of routes module', function() {
        it('should returns the current config', function(done) {
            routes.config = JSON.parse( JSON.stringify( configOk ) );
            routes.getConfig().should.eql(configOk);
            done();
        });
    });

    describe('Test updateConfig method of routes module', function() {
        describe('with an incorrect config file', function() {
            it('should returns false', function(done) {
                routes.config = JSON.parse( JSON.stringify( configOk ) );
                routes.updateConfig("foo").should.eql(false);
                done();
            });
            it('should not modify config property', function(done) {
                routes.config.should.eql(configOk);
                done();
            });
        });
        describe('with an correct config file but with same method and path', function() {
            it('should returns true', function(done) {
                routes.config = JSON.parse( JSON.stringify( configOk ) );
                routes.updateConfig(updateOkSame).should.eql(true);
                done();
            });
            it('should not modify config', function(done) {
                routes.config.length.should.eql(1);
                routes.config.should.eql(configOk);
                done();
            });
        });
        describe('with an correct config file and diffrent method or path', function() {
            it('should returns true', function(done) {
                routes.config = JSON.parse( JSON.stringify( configOk ) );
                routes.updateConfig(updateOkDifferent).should.eql(true);
                done();
            });
            it('should modify config', function(done) {
                routes.config.length.should.eql(2);
                routes.config[0].httpRequest.method.should.eql('get');
                routes.config[1].httpRequest.method.should.eql('post');
                done();
            });
        });
    });
});