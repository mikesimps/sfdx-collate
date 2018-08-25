sfdx-collate
=============



[![Version](https://img.shields.io/npm/v/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![CircleCI](https://circleci.com/gh/mikesimps/sfdx-collate/tree/master.svg?style=shield)](https://circleci.com/gh/mikesimps/sfdx-collate/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/mikesimps/sfdx-collate?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-collate/branch/master)
[![Codecov](https://codecov.io/gh/mikesimps/sfdx-collate/branch/master/graph/badge.svg)](https://codecov.io/gh/mikesimps/sfdx-collate)
[![Greenkeeper](https://badges.greenkeeper.io/mikesimps/sfdx-collate.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/mikesimps/sfdx-collate/badge.svg)](https://snyk.io/test/github/mikesimps/sfdx-collate)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-collate.svg)](https://npmjs.org/package/sfdx-collate)
[![License](https://img.shields.io/npm/l/sfdx-collate.svg)](https://github.com/mikesimps/sfdx-collate/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-collate
$ sfdx-collate COMMAND
running command...
$ sfdx-collate (-v|--version|version)
sfdx-collate/0.1.0 darwin-x64 node-v8.9.4
$ sfdx-collate --help [COMMAND]
USAGE
  $ sfdx-collate COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx-collate collate:compare:create [FILE]`](#sfdx-collate-collatecomparecreate-file)
* [`sfdx-collate collate:compare:files [FILE]`](#sfdx-collate-collatecomparefiles-file)

## `sfdx-collate collate:compare:create [FILE]`

Compares two metadatafiles

```
USAGE
  $ sfdx-collate collate:compare:create [FILE]

OPTIONS
  -f, --file=file                                 (required) Path to primary file
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation

EXAMPLE
  $ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml
```

_See code: [src/commands/collate/compare/create.ts](https://github.com/mikesimps/sfdx-collate/blob/v0.1.0/src/commands/collate/compare/create.ts)_

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
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
