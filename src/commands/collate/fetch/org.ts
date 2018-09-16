import { core, flags, SfdxCommand } from '@salesforce/command';
import { execSync } from 'child_process';
import * as del from 'del';
import * as fs from 'fs-extra';
import * as StreamZip from 'node-stream-zip';
import { Packagexml } from '../../../lib/Packagexml';

core.Messages.importMessagesDirectory(__dirname);
const messages = core.Messages.loadMessages('sfdx-collate', 'fetchorg');

export default class OrgXML extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx collate:fetch:org -u myOrg@example.com -d
    <?xml version="1.0" encoding="UTF-8"?>
    <Package xmlns="http://soap.sforce.com/2006/04/metadata">...</Package>
  `
  ];

  protected static flagsConfig = {
    dxformat: flags.boolean({ char: 'd', description: messages.getMessage('dxFlagDescription') }),
    targetdir: flags.string({ char: 't', description: messages.getMessage('targetDirFlagDescription') }),
    excludemanaged: flags.boolean({ char: 'x', description: messages.getMessage('excludeManagedFlagDescription') }),
    config: flags.string({ char: 'c', description: messages.getMessage('configFlagDescription') }),
    quickfilter: flags.string({ char: 'q', description: messages.getMessage('quickfilterFlagDescription') }),
    skipcleanup: flags.boolean({ char: 's', description: messages.getMessage('skipCleanupFlagDescription') })
  };

  protected static requiresUsername = true;
  protected static supportsDevhubUsername = false;
  protected static requiresProject = true;

  public async run() {

    const dx: boolean = this.flags.dxformat || false;
    const targetDir = this.flags.targetdir || '.';
    const tempDir = './temp_collate_fetch_org';
    const apiVersion =  this.flags.apiversion || await this.org.retrieveMaxApiVersion();
    const skipCleanup = this.flags.skipcleanup || false;
    const conn = this.org.getConnection();
    try {
      fs.mkdirSync(tempDir);
    } catch ( err ) {
      if ( err.code !== 'EEXIST') { console.log(err); }
    }
    const packageXML: Packagexml = new Packagexml(conn, this.flags.config, this.flags.quickfilter, this.flags.excludemanaged, apiVersion);

    this.ux.startSpinner('Building package.xml');
    const packagexml = await packageXML.build('xml');
    fs.writeFileSync(tempDir + '/package.xml', packagexml);
    this.ux.stopSpinner('Package.xml built');

    let srcFolder = tempDir;
    const cmdStr = 'sfdx force:mdapi:retrieve -w 10 -k ' + tempDir + '/package.xml -a ' + apiVersion + ' -r ' + tempDir + ' -u ' + this.flags.targetusername;
    execSync(cmdStr, {stdio: [0, 1, 2]});

    this.ux.startSpinner('Unzipping Metadata');
    const zip = new StreamZip({
        file: tempDir + '/unpackaged.zip',
        storeEntries: true
    });
    zip.on('ready', () => {
      zip.extract(null, tempDir, (err, count) => {
          this.ux.log(err ? 'Extract error' : `Extracted ${count} entries`);
          zip.close();

          if ( dx === true ) {
            srcFolder += '/dxunpackaged';
            this.ux.startSpinner('Converting to sfdx format');
            execSync('sfdx force:mdapi:convert -r ' + tempDir + '/unpackaged -d ' + srcFolder);
            this.ux.stopSpinner('done');
          } else {
            srcFolder += '/unpackaged';
          }

          this.ux.startSpinner('Moving files to target directory');
          fs.move(srcFolder , targetDir, { overwrite: true }, mverr => {
            if ( mverr ) {
              this.ux.log(mverr);
            }
          });
          this.ux.stopSpinner('done');

          if ( !skipCleanup ) {
            this.ux.startSpinner('Cleaning up temp files');
            del([tempDir]);
            this.ux.stopSpinner('done');
          }
      });
    });
  }
}
