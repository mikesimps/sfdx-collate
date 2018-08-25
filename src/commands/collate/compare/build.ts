import {core, flags, SfdxCommand} from '@salesforce/command';
import { Deserialize, Serialize } from 'cerialize';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { compareObjects, Comparison, comparisonsToCSV, csvToComparisons, sortByProperty } from '../../../lib/Comparison';
import { PermissionSet } from '../../../lib/Permissionset';
import { xmlToInstance } from '../../../lib/Utils';

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

    const compFile: string = fs.readFileSync(this.flags.file, 'utf8');

    const cmp: Comparison[] = csvToComparisons(compFile).sort(sortByProperty('key'));

    const obj: object = {};
    let i = 0;
    do {
      const props: string[] = cmp[i].key.split('|');
      let j: number = 1; // first property is always the Object
      const property: string = props[j];
      do {

        if (property.startsWith('^') && property.endsWith('^')) {
          // this is part of an array/nested object with this as the value
          Object.keys(cmp[i]).find(key => cmp[i][key] === property); // go get the key based off the value
        } else if ( j === props.length - 1 ) {

        }

        j++;
      } while ( j < props.length );

      i++;
    } while ( i < cmp.length);

    // const obj = Serialize(xmlToInstance(compFile));
    // const str = 'PermissionSet';
    // const builder = new xml2js.Builder();
    // const obj2 = {};
    // obj2[str] = obj;
    // const xml = builder.buildObject(obj2);

    // console.log(xml);

    return null;
  }
}
