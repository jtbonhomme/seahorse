![](https://github.com/jtbonhomme/seahorse/raw/dev/assets/icon_50121.png)

seahorse
========

Seahorse is a configurable mock REST API. I may be used for testing and it is written in javascript.

Install it
==========

To use in a node script
-----------------------

```
% npm install seahorse --save
````

To use as a standalone server
-----------------------------

```
% npm install -g seahorse
````

Use it
======

In a node script
----------------

Start a mock REST API server with a configuration file (config.json) that listen on port 3000 and displays 'apache-like' logs.

```js
var server = require('seahorse');
console.log("Start seahorse server");
server.init('config.json', 3000, {"logs": true});
```

The initialization function prototype is :

```js
server.init(file, port, options)
```

* file (string)    : can be both an absolute or a relative path to a configuration file
* port (number)    : allow to specify the port of the express server
* options (object) : can activate extra functionnalities:
    * traces (boolean) : activates debug traces
    * logs (boolean)   : activates apache logs traces
    * cors (boolean)   : configures cors directives

As a standalone server
----------------------

Start a mock REST API server with no configuration (no route defined) that listen on port 3000 by default.

```
% seahorse
```

Start a mock REST API server with a configuration file (config.json) that listen on port 4000.

```
% seahorse -f config.json -p 4000
```

Display help.

```
% seahorse config.json -h
Usage: seahorse [options] [-f <source>]

Options:
  --help    -h          display this text
  --version -v          output version
  --file    -f <source> load configuration file
  --logs    -l          activate logs   (default: no log)
  --trace   -t          activate traces (default: no trace)
  --nocors  -n          deactivate CORS (default: activated)
  --port    -p <port>   set port

Examples:
  seahorse -f config.json
  seahorse --port 1234
```

As a javascript library
-----------------------

```
var server   = require('../vendor/seahorse.min').server;

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
  }
];

server.start(config, 3000);
```

See [example/example.js](example/example.js) for a  very simple use of the lib.

Configuration file format
=========================

The configuration file contains an array of route objects.
Every route object is built with two keys: httpRequest witch make seahorse check if a request matches with this route, and httpResponse that gives seahorse the appropriate response to send in case the request matches the route.

Read the [configuration file schema](SCHEMA.md) to check the JSON syntax.

httpRequest key
---------------

The httpRequest key has a value that is an object that shall contains two keys: method (get, post, put or delete) and path.
The path key may be either a simple string (<code>"path": "/foo/api.json"</code>) or a regexp. 
To use regexp as route path, you shall prefix the regexp with a string <code>"regexp:"</code> (<code>"path" : "regexp:^\/foo\/.*\.json$"</code>)
The previous example will match <code>/foo/bar.json</code> and <code>/foo/bar/bas.json</code> but will not match <code>/foo.json</code> neither <code>foo/bar.jsonx</code>

In addition, query parameters may be specified. The query key is an object in witch each key is a parameter with its value.

For example, the following httpRequest object : 

```
httpRequest: {
  method: "get",
  path: "/foo",
  query: {
    "name": "john"
  }
}
```

Will math <code>GET /foo?name=john</code>, but will not match <code>GET /foo</code>, <code>GET /foo?name=jack</code>, <code>GET /bar?name=john</code> or <code>POST /foo?name=john</code>

httpResponse key
----------------

The httpResponse is an object that specify, if the request matches the httpRequest object:
* the status code to be sent in the response with the key <code>statusCode</code>, 
* the payload can be specified with one of these keys
    * <code>body</code>   : object to be returned in the response payload,
    * <code>file</code>   : path of a static local file to be returned in the response payload, 
    * <code>static</code> : local root path to search for resources to be returned in the response payload (for example, if path equals <code>/foo/bar.txt</code> and static equals <code>/home/jtbonhomme/seahorse/static</code>, the seahorse will serve the file <code>/home/jtbonhomme/seahorse/static/foo/bar.txt</code>) 
* optionnaly, in case of static file shall be served (use of <code>file</code> or <code>static</code>), you can specify a maximum <code>bandwidth</code> (in bytes per seconds) to serve the file.
* optionnaly, some <code>headers</code> to be added to the response, 
* and, optionnaly, a <code>delay</code> that will simulate server latency can be added.

Example
-------

See [example/config.json](example/config.json) :
 
```
[{
  "httpRequest" : {
      "method" : "get",
      "path" : "/help",
      "query" : {
        "id": 1,
        "format": "json"
      }
  },
  "httpResponse" : {
      "statusCode" : 200,
      "file":"/Users/jean-thierrybonhomme/Developments/seahorse/lib/help.txt",
      "headers" : [ {
          "name": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
      },
      {
          "name": "Content-Type",
          "value": "text/plain"
      } ],
      "delay": 2000
  }
}]
```

Buildin API
===========

Seahorse uses a specific route for its internal needs (<code>_config</code>)
Obviously, you can not use this path for your own needs.

Once you started seahorse (given you started it on localhost:3000), you can call /_config:

## get /_config

Return the current configuration

```
% curl "http://localhost:3000/_config"
[{"httpRequest":{"method":"delete","path":"/help"},"httpResponse":{"statusCode":200,"body":"{\"key\": \"value\"}","headers":[{"name":"Access-Control-Allow-Headers","value":"Content-Type, Authorization"},{"name":"Content-Type","value":"application/json; charset=utf-8"}],"delay":1}}]
```

## post /_config

Set a new configuration

```
% curl -X POST --data '[{"httpResquest":...}]' "http://localhost:3000/_config"
```

## put /_config

Update the configuration. If new routes are specified, they will be added, else, current routes will be updated.

```
% curl -X PUT --data '[{"httpResquest":...}]' "http://localhost:3000/_config"
```

## get /stream

A SSE functionnality is available on route <code>get /stream</code>. 

## post /stream/:event_name

Any event can be fired to all listeners with the route <code>post /stream/:event_name</code>
Take care, for now, data SHALL be in JSON format.

To simulate a SSE event sent by the mock API, try :

```
curl -X POST -H "Content-Type: application/json" --data '{"data":{"326":[18,8,true,false]}, "signal":"LastChange"}' localhost:3000/stream/message
```

Test
====

Launch tests with :

```
% grunt test
```

Thanks
======

This project uses these third packages:

* [express](http://expressjs.com/)
* [hippie](https://github.com/vesln/hippie)
* [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test)
* [should](https://github.com/visionmedia/should.js)
* [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon)
* [minimist](https://github.com/substack/minimist)
* [node-throttle](https://github.com/TooTallNate/node-throttle)

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

The seahorse logo was designed by [Les vieux garcons](http://www.thenounproject.com/enrique427).

Todo
====

* Add unit tests on content-lenght header in responses
* Possible issue when using bandwidth field, no Content-length is sent in the response
* Handle cookies

Licence
=======

This software is provided under [MIT licence](LICENCE.md).
