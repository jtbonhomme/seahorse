#!/usr/bin/env node

var main       = require('../lib/main');
var minimist       = require('minimist');

var argv = minimist(process.argv.slice(2));
main.run(argv);
