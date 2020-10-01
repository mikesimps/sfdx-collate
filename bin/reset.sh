#!/bin/bash
rm -f ./sharingrule_*.csv
rm -f ./sharingrule_*.xml
rm -f ./permissionset_*.csv
rm -f ./permissionset_*.xml
rm -f ./npm-shrinkwrap.json
rm -R ./node_modules
rm -f ./oclif.manifest.json

yarn install