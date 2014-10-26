#!/bin/bash
git checkout master
git push && npm publish && npm install -g seahorse && seahorse -v
