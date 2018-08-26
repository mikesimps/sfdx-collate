sfdx-collate
=============

[![Version](https://img.shields.io/npm/v/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![Known Vulnerabilities](https://snyk.io/test/github/mikesimps/sfdx-collate/badge.svg)](https://snyk.io/test/github/mikesimps/sfdx-collate)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![License](https://img.shields.io/npm/l/sfdx-collate.svg)](https://github.com/mikesimps/sfdx-collate/blob/master/package.json)

<!-- toc -->

<!-- tocstop -->
<!-- install -->
<!-- installstop -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-collate
$ sfdx-collate COMMAND
running command...
$ sfdx-collate (-v|--version|version)
sfdx-collate/0.1.0 darwin-x64 node-v10.9.0
$ sfdx-collate --help [COMMAND]
USAGE
  $ sfdx-collate COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx-collate collate:compare:build [FILE]`](#sfdx-collate-collatecomparebuild-file)
* [`sfdx-collate collate:compare:files [FILE]`](#sfdx-collate-collatecomparefiles-file)

## `sfdx-collate collate:compare:build [FILE]`

Generate metadata file from a csv list of comparisons

```
USAGE
  $ sfdx-collate collate:compare:build [FILE]

OPTIONS
  -f, --file=file                                 (required) Path to primary file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:build --file directory/comparison.csv
```

_See code: [src/commands/collate/compare/build.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.1.0/src/commands/collate/compare/build.ts)_

## `sfdx-collate collate:compare:files [FILE]`

Compares two metadatafiles

```
USAGE
  $ sfdx-collate collate:compare:files [FILE]

OPTIONS
  -p, --primary=primary                           (required) Path to primary file
  -s, --secondary=secondary                       (required) Path to secondary file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml
```

_See code: [src/commands/collate/compare/files.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.1.0/src/commands/collate/compare/files.ts)_
<!-- commandsstop -->
