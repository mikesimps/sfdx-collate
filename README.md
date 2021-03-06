# sfdx-collate

This plugin was written to make it easier for developers (and admins!) to help analyze and clean up their Salesforce org metadata. Initial functionality is focused on permission based metadata which are particularly painful to compare and merge because of their size and complexity. This project has also absorbed and enhanced part of the functionality of another project: sfdx-hydrate. This project made it very easy to create a package.xml file without relying on 3rd party hosted tools. Supported metadata types for compare functionality are listed below. Contributions and requests/ideas are welcomed.

|Type| Notes |
|-:|:-:|
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

### Try it out

Clone the sample gist:

```
git clone git@gist.github.com:6427ea434581058a14fd3b084b87a5ff.git
```

Move into directory:

```
cd 6427ea434581058a14fd3b084b87a5ff/
```

Make script executable:

```
chmod +x ./sfdx-collate-permissionsets.sh
```

Generate examples:

```
./sfdx-collate-permissionsets.sh
```

**OR**
Run a specific example:

``` bash
sfdx collate:compare:files  -p PermissionSet1.xml -s PermissionSet2.xml > permissionset_default.csv
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

### Config File

An example config file is defined below. The "quickfilter" array lets you specify a list of metadata types that will be included in the output. You can have the xml output formatted by setting the "formatxml" to true.

Note: commandline parameters will **_override_** what is in the config file

```javascript
    //config.json
    {
        "quickFilters": ["Report",
            "Dashboard",
            "ReportType"
        ],
        "apiVersion": "40.0",
        "excludeManaged": "true",
        "targetDir": ".",
        "skipcleanup": "false",
        "dxFormat": "false"
    }

```

## Commands

<!-- commands -->
* [`sfdx-collate collate:compare:api -t <string> -p <string> -s <string> [-m <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-collate-collatecompareapi--t-string--p-string--s-string--m-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx-collate collate:compare:build -f <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-collate-collatecomparebuild--f-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx-collate collate:compare:files -p <string> -s <string> [-m <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-collate-collatecomparefiles--p-string--s-string--m-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx-collate collate:fetch:packagexml [-c <string>] [-q <string>] [-x] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-collate-collatefetchpackagexml--c-string--q-string--x--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx-collate collate:compare:api -t <string> -p <string> -s <string> [-m <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Compares two metadatafiles. Currently only PermissionSet files are supported.

```
USAGE
  $ sfdx-collate collate:compare:api -t <string> -p <string> -s <string> [-m <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -m, --mode=full|inner|exact|diff                                                  What comparison values should be
                                                                                    returned

  -p, --primary=primary                                                             (required) sfdxAlias.apiName of
                                                                                    primary metadata file

  -s, --secondary=secondary                                                         (required) sfdxAlias.apiName of
                                                                                    secondary metadata file

  -t, --metadatatype=PermissionSet|Profile|SharingRules                             (required) The metadata type to be
                                                                                    compared

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx collate:compare:api --metadataType PermissionSet --primary uat.All_Users --secondary prod.All_Users --mode full

  "obj","key","primary","secondary","final","change"
  ...
```

_See code: [src/commands/collate/compare/api.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.5.3/src/commands/collate/compare/api.ts)_

## `sfdx-collate collate:compare:build -f <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Generate metadata file from a csv list of comparisons. The csv can be generated using the collate:compare:files command and expects a specific format.

```
USAGE
  $ sfdx-collate collate:compare:build -f <string> [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --file=file                                                                   (required) Path to csv comparison
                                                                                    file

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx collate:compare:build --file directory/comparison.csv
```

_See code: [src/commands/collate/compare/build.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.5.3/src/commands/collate/compare/build.ts)_

## `sfdx-collate collate:compare:files -p <string> -s <string> [-m <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Compares two metadatafiles. Currently only PermissionSet files are supported.

```
USAGE
  $ sfdx-collate collate:compare:files -p <string> -s <string> [-m <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -m, --mode=full|inner|exact|diff                                                  What comparison values should be
                                                                                    returned

  -p, --primary=primary                                                             (required) Path to primary file

  -s, --secondary=secondary                                                         (required) Path to secondary file

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml --mode full

  "obj","key","primary","secondary","final","change"
  ...
```

_See code: [src/commands/collate/compare/files.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.5.3/src/commands/collate/compare/files.ts)_

## `sfdx-collate collate:fetch:packagexml [-c <string>] [-q <string>] [-x] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Create a package.xml file from a target org

```
USAGE
  $ sfdx-collate collate:fetch:packagexml [-c <string>] [-q <string>] [-x] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --config=config                                                               Configuration file to help make
                                                                                    pulling metadata more scriptable

  -q, --quickfilter=quickfilter                                                     CSV list of metadata types to filter

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -x, --excludemanaged                                                              Exclude managed packages (and
                                                                                    related items) from output

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx collate:fetch:packagexml --targetusername myOrg@example.com
       <?xml version="1.0" encoding="UTF-8"?>
       <Package xmlns="http://soap.sforce.com/2006/04/metadata">...</Package>
```

_See code: [src/commands/collate/fetch/packagexml.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.5.3/src/commands/collate/fetch/packagexml.ts)_
<!-- commandsstop -->
