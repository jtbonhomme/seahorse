seahorse
========

Configurable mock REST API testing tool written in javascript.

Install it
==========

```
% npm install seahorse
````


Use it
======

Start a mock REST API server with no configuration (no route defined) that listen on port 3000 by default.

```
% seahorse
```

Start a mock REST API server with a configuration file (config.json) that listen on port 4000.

```
% seahorse config.json -p 4000
```

Configuration file
==================

```
{
  "routes": [{
    "httpRequest" : {
        "method" : "POST",
        "path" : "/help"
    },
    "httpResponse" : {
        "statusCode" : 200,
        "body" : "{\"key\": \"value\"}",
        "headers" : [ {
            "name": "Content-Type",
            "values": ["application/json"]
        } ],
        "delay": {
            "value": 1
        }
    }
  },
  {
    "httpRequest" : {
        "method" : "GET",
        "path" : "/help",
        "queryString" : "id=1"
    },
    "httpResponse" : {
        "statusCode" : 200,
        "file":"/lib/help.txt",
        "headers" : [ {
            "name": "Content-Type",
            "values": ["application/json"]
        } ],
        "delay": {
            "value": 1000
        }
    }
  }]
}
```
