import { core, flags, SfdxCommand } from '@salesforce/command';
import { Packagexml } from '../../../lib/Packagexml';

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('sfdx-collate', 'packagexml');

export default class PackageXML extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx collate:fetch:packagexml --targetusername myOrg@example.com
    <?xml version="1.0" encoding="UTF-8"?>
    <Package xmlns="http://soap.sforce.com/2006/04/metadata">...</Package>
  `
  ];

  protected static flagsConfig = {
    config: flags.string({ char: 'c', description: messages.getMessage('configFlagDescription') }),
    quickfilter: flags.string({ char: 'q', description: messages.getMessage('quickfilterFlagDescription') }),
    excludemanaged: flags.boolean({ char: 'x', description: messages.getMessage('excludeManagedFlagDescription') })
  };

  protected static requiresUsername = true;
  protected static supportsDevhubUsername = false;
  protected static requiresProject = false;

  public async run() {
    // const fileType = this.flags.json ? 'json' : 'xml';
    const conn = this.org.getConnection();
    const packageXML: Packagexml = new Packagexml(conn, this.flags.config, this.flags.quickfilter, this.flags.excludemanaged, this.flags.apiversion || await this.org.retrieveMaxApiVersion());
    console.log(await packageXML.build('xml'));
  }
}
