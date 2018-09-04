# sfdx-collate
This plugin was written to make it easier for developers (and admins!) to help analyze and clean up their Salesforce org metadata. Initial functionality is focused on permission based metadata which are particularly painful to compare and merge because of their size and complexity. Supported metadata types listed below. Contributions and requests/ideas are welcomed.

|Type| Notes |
|-|-|
|PermissionSet|
|Profile|
|SharingRules|

[![Version](https://img.shields.io/npm/v/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![Known Vulnerabilities](https://snyk.io/test/github/mikesimps/sfdx-collate/badge.svg)](https://snyk.io/test/github/mikesimps/sfdx-collate)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![License](https://img.shields.io/npm/l/sfdx-collate.svg)](https://github.com/mikesimps/sfdx-collate/blob/master/package.json)

<!-- install -->

## Install from source

1. Install the SDFX CLI.
2. Clone the repository: `git clone git@github.com:mikesimps/sfdx-collate.git`
3. Install npm modules: `npm install`
4. Link the plugin: `sfdx plugins:link .`

## Install as plugin

1. Install plugin: `sfdx plugins:install sfdx-collate`

<!-- installstop -->

### Try it out!

1. Clone the sample gist:
```
$ git clone git@gist.github.com:6427ea434581058a14fd3b084b87a5ff.git
```
2. Move into directory: 
```
$ cd 6427ea434581058a14fd3b084b87a5ff/
```
3. Make script executable: 
```
$ chmod +x ./sfdx-collate-permissionsets.sh
```
4. Generate examples:
```
$ ./sfdx-collate-permissionsets.sh` 
```
**OR** Run a specific example:
```
$ sfdx collate:compare:files  -p PermissionSet1.xml -s PermissionSet2.xml > permissionset_default.csv
```

## Info

### Comparison File Format

Output as a CSV for easy editing. When using the build command, it blindly uses whatever values are in the final column which means you can overwrite it with whatever you need.

| field  | purpose
|---|---
| obj  |  the metadata file type being compared
| key  | the unique value for each row in the file
| primary  | the xml property value (between the tags) for the primary file
| secondary  | the xml property value (between the tags) for the secondary file
| final | the value that will be used in the build process, set depending on mode used
| change | Match - exact match in key and value <br/>Add - key did not exist in one of the files<br/>Update - keys were matched, but values are different

### Comparison Modes

| mode  | output
|---|---
| full | (default) include all items from both files<br>final value is set to primary if it exists
| diff | only include items that are different (adds or updates)<br>final value is set to primary if it exists, otherwise secondary
| exact | only includes items where keys and values match exactly<br>final value is set to primary
| inner | only includes items where keys match, but values can be different<br>final value is set to primary

### Command Parameter Format collate:compare:api

The command requires a shorthand of `sfdxAlias.APIName` which is then parsed. For Profiles that have spaces in their names, you will have to escape the name when passing it. For example `My Profile Name` would be:

... -p myorg.`My\ Profile\ Name` -s ...

For Standard Profile you must use their API names which are not intuitive.

| Profile Name  | Profile fullName (api name)
|---|---
|System Administrator | Admin
|Standard User | Standard

Full List of Standard Profile API Names: [Here](https://salesforce.stackexchange.com/questions/159005/listing-of-all-standard-profiles-and-their-metadata-api-names)



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
  -m, --mode=full|inner|exact|diff                       What comparison values should be returned
  -p, --primary=primary                                  (required) sfdxAlias.apiName of primary metadata file
  -s, --secondary=secondary                              (required) sfdxAlias.apiName of secondary metadata file
  -t, --metadatatype=PermissionSet|Profile|SharingRules  (required) The metadata type to be compared
  --json                                                 format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)         logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:api --metadataType PermissionSet --primary uat.All_Users --secondary prod.All_Users --mode full

  "obj","key","primary","secondary","final","change"
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

  "obj","key","primary","secondary","final","change"
  ...
```

_See code: [src/commands/collate/compare/files.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.2.0/src/commands/collate/compare/files.ts)_
<!-- commandsstop -->
