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
  `$ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml
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
    const primaryFilePath = this.flags.primary;
    const secondaryFilePath = this.flags.secondary;

    const opts = { explicitArray: false };
    const primaryParser = new xml2js.Parser(opts);
    const secondaryParser = new xml2js.Parser(opts);

    const primaryXML: string = fs.readFileSync(primaryFilePath, 'utf8');
    const secondaryXML: string = fs.readFileSync(secondaryFilePath, 'utf8');

    let primaryObj: object;
    let primaryStr: string;
    primaryParser.parseString(primaryXML, (_err, result) => {
        primaryObj = result;
        primaryStr = JSON.stringify(result);
    });

    let secondaryObj: object;
    let secondaryStr: string;
    secondaryParser.parseString(secondaryXML, (_err, result) => {
        secondaryObj = result;
        secondaryStr = JSON.stringify(result);
    });
    // console.log(primaryObj.PermissionSet);
    // console.log(new PermissionSet().deserialize(primaryObj.PermissionSet));
    // console.log(new PermissionSet().deserialize(primaryObj.PermissionSet));
    // console.log(secondary);

    primaryObj = Deserialize(primaryObj['PermissionSet'], PermissionSet);
    secondaryObj = Deserialize(secondaryObj['PermissionSet'], PermissionSet);

    let cmp: Comparison[] = [];
    const objectName: string = primaryObj.constructor.name;

    function traverse(obj, obj2) {
        if ( typeof obj === 'object') {
            for (const p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] instanceof Array) {
                        cmp = cmp.concat(compareObjects(objectName + '|' + p, obj[p], obj2[p], 'left'));
                        traverse(obj[p], obj2[p]);
                    } else if (isNaN(Number(p))) {
                        cmp = cmp.concat(compareObjects(objectName + '|' + p, {[p]: obj[p]}, {[p]: obj2[p]}, 'left'));
                    }
                }
            }
            return obj;
        }
    }

    traverse(primaryObj, secondaryObj); // this is the problem
    console.log(comparisonsToCSV(cmp));

    return null;
  }
}
