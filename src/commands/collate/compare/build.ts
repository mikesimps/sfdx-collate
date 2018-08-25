import {core, flags, SfdxCommand} from '@salesforce/command';
import { Deserialize } from 'cerialize';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { compareObjects, Comparison, comparisonsToCSV } from '../../../lib/Comparison';
import { PermissionSet } from '../../../lib/Permissionset';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-collate', 'create');

export default class Files extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx collate:compare:build --file directory/comparison.csv
  `
  ];

  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    file: flags.string({char: 'f', description: messages.getMessage('fileFlagDescription'), required: true})
  };

  // Comment this out if your command does not require an org username
  // protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  // public async run(): Promise<core.AnyJson> {
  public run() {
    const primaryFilePath = this.flags.file;

    return null;
  }
}
