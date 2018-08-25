import { core, flags, SfdxCommand } from '@salesforce/command';
import * as fs from 'fs';
import { inspect } from 'util';
import { compareObjects } from '../../../lib/Comparison';
import { xmlToInstance, xmlToJson } from '../../../lib/Utils';

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('sfdx-collate', 'files');

export default class Files extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx collate:compare:files --primary directory/file1.xml --secondary directory/file2.xml
  `
    ];

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        primary: flags.string({ char: 'p', description: messages.getMessage('primaryFlagDescription'), required: true }),
        secondary: flags.string({ char: 's', description: messages.getMessage('secondaryFlagDescription'), required: true })
    };

    // Comment this out if your command does not require an org username
    // protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    // protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    // public async run(): Promise<core.AnyJson> {
    public run() {

        const primaryXML: string = fs.readFileSync(this.flags.primary, 'utf8');
        const secondaryXML: string = fs.readFileSync(this.flags.secondary, 'utf8');
        // console.log(inspect(xmlToJson(primaryXML),{depth: null}));
        console.log(compareObjects(xmlToInstance(primaryXML), xmlToInstance(secondaryXML)));

        return null;
    }
}
