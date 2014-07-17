#!/usr/bin/env node

var seahorse       = require('../lib/main');
var minimist       = require('minimist');

var argv = minimist(process.argv.slice(2));
seahorse.run(argv);
