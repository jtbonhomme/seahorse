Configuration file schema
=========================

> plese refer to [JSON Schema v4](http://json-schema.org/

```
{
  "title" : "Seahorse configuration file JSON Schema - v4",
  "type" : "array",
  "items" : {
    "title" : "Mock API requests and responses definition",
    "type" : "object",
    "properties" : {
      "httpRequest" : {
        "type" : "object",
        "optional" : false,
        "properties" : {
          "method" :  {
            "type" : "string",
            "enum" : ["get", "post", "put", "delete"],
            "required" : true
          },
          "path" :  {
            "type" : "string",
            "required" : true
          },
          "query" :  {
            "type" : "object",
            "required" : false
          }
        }
      },
      "httpResponse" : {
        "type" : "object",
        "required" : true,
        "properties" : {
          "statusCode" :  {
            "type" : "number",
            "required" : false
          },
          "body" :  {
            "type" : "string",
          },
          "file" :  {
            "type" : "string",
            "format": "url",
          },
          "static" :  {
            "type" : "string",
            "format": "url",
          },
          "header" :  {
            "type" : "array",
            "required" : false,
            "items": {
              "type" : "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "value": {
                  "type": "string"
                }
              }
            }
          },
          "delay" :  {
            "type" : "number",
            "required" : false
          },
        }
      }
    },
    "minimum" : 1
  }
}
```
