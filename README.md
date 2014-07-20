seahorse
========

Seahorse is a configurable mock REST API. I may be used for testing and it is written in javascript.

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

Display help.

```
% seahorse config.json -h
```

Configuration file format
=========================

Read the [configuration file schema](SCHEMA.md) to check the JSON syntax.

Example
-------

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
% curl -X POST --data '[{"httpResquest":...}]' "http://localhost:3000/_config"
```
