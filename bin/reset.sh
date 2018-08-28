#!/bin/bash
rm ./npm-shrinkwrap.json
rm ./yarn.lock
rm -R ./node_modules
rm ./oclif.manifest.json

npm install