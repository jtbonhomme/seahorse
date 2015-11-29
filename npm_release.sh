#!/bin/bash
git checkout master
git push && git push --tags && npm publish && npm install -g seahorse && seahorse -v
