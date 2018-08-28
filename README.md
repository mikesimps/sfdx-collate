# sfdx-collate

[![Version](https://img.shields.io/npm/v/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![Known Vulnerabilities](https://snyk.io/test/github/mikesimps/sfdx-collate/badge.svg)](https://snyk.io/test/github/mikesimps/sfdx-collate)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![License](https://img.shields.io/npm/l/sfdx-collate.svg)](https://github.com/mikesimps/sfdx-collate/blob/master/package.json)

## Purpose

This plugin was written to make it easier for developers (and even admins) to help analyze and clean up their Salesforce org metadata. Initial functionality is focused on Permission Sets which are particularly painful to compare and merge because of their size and complexity. Currently that is the only metadata type that is supported, but see the issues board for more information on what may be coming. Contributions and requests/ideas are welcomed.

<!-- install -->

## Install from source

1. Install the SDFX CLI.
2. Clone the repository: `git clone git@github.com:mikesimps/sfdx-collate.git`
3. Install npm modules: `npm install`
4. Link the plugin: `sfdx plugins:link .`

## Install as plugin

1. Install plugin: `sfdx plugins:install sfdx-collate`

<!-- installstop -->

## Commands

<!-- commands -->
* [`sfdx-collate collate:compare:api`](#sfdx-collate-collatecompareapi)
* [`sfdx-collate collate:compare:build`](#sfdx-collate-collatecomparebuild)
* [`sfdx-collate collate:compare:files`](#sfdx-collate-collatecomparefiles)

## `sfdx-collate collate:compare:api`

Compares two metadatafiles. Currently only PermissionSet files are supported.

```
USAGE
  $ sfdx-collate collate:compare:api

OPTIONS
  -m, --mode=full|inner|exact|diff                What comparison values should be returned
  -p, --primary=primary                           (required) sfdxAlias.apiName of primary metadata file
  -s, --secondary=secondary                       (required) sfdxAlias.apiName of secondary metadata file
  -t, --metadatatype=PermissionSet|Profile        (required) The metadata type to be compared
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:api --metadataType PermissionSet --primary uat.All_Users --secondary prod.All_Users --mode full
           "obj","key","primary","secondary","final","change"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|application","Application1","Applica
  tion1","Application1","Update"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|visible","true","true","true","Updat
  e"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|application","Application2",,,"Add"
           "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|visible","false",,,"Add"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|application","Application3","Applica
  tion3","Application3","Update"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|visible","false","true","true","Upda
  te"
           ...
```

_See code: [src/commands/collate/compare/api.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.2.0/src/commands/collate/compare/api.ts)_

## `sfdx-collate collate:compare:build`

Generate metadata file from a csv list of comparisons. The csv can be generated using the collate:compare:files command and expects a specific format.

```
USAGE
  $ sfdx-collate collate:compare:build

OPTIONS
  -f, --file=file                                 (required) Path to csv comparison file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:build --file directory/comparison.csv
```

_See code: [src/commands/collate/compare/build.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.2.0/src/commands/collate/compare/build.ts)_

## `sfdx-collate collate:compare:files`

Compares two metadatafiles. Currently only PermissionSet files are supported.

```
USAGE
  $ sfdx-collate collate:compare:files

OPTIONS
  -m, --mode=full|inner|exact|diff                What comparison values should be returned
  -p, --primary=primary                           (required) Path to primary file
  -s, --secondary=secondary                       (required) Path to secondary file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml --mode full
           "obj","key","left","right","primary","change"
         
  "PermissionSet","PermissionSet|fieldPermissions|^field:Custom_Object__c.Custom_Field__c^|editable","false","false","le
  ft","Update"
           "obj","key","primary","secondary","final","change"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|application","Application1","Applica
  tion1","Application1","Update"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|visible","true","true","true","Updat
  e"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|application","Application2",,,"Add"
           "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|visible","false",,,"Add"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|application","Application3","Applica
  tion3","Application3","Update"
         
  "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|visible","false","true","true","Upda
  te"
           ...
```

_See code: [src/commands/collate/compare/files.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.2.0/src/commands/collate/compare/files.ts)_
<!-- commandsstop -->
