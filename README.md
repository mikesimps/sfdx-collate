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
* [`sfdx-collate collate:compare:build`](#sfdx-collate-collatecomparebuild)
* [`sfdx-collate collate:compare:files`](#sfdx-collate-collatecomparefiles)

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

_See code: [src/commands/collate/compare/build.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.1.0/src/commands/collate/compare/build.ts)_

## `sfdx-collate collate:compare:files`

Compares two metadatafiles. Currently only PermissionSet files are supported.

```
USAGE
  $ sfdx-collate collate:compare:files

OPTIONS
  -p, --primary=primary                           (required) Path to primary file
  -s, --secondary=secondary                       (required) Path to secondary file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml
           "obj","key","left","right","primary","change"
         
  "PermissionSet","PermissionSet|fieldPermissions|^field:Custom_Object__c.Custom_Field__c^|editable","false","false","le
  ft","Update"
           ...
```

_See code: [src/commands/collate/compare/files.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.1.0/src/commands/collate/compare/files.ts)_
<!-- commandsstop -->
