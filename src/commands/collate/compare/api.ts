import { core, flags, SfdxCommand } from '@salesforce/command';
import { Connection, Org } from '@salesforce/core';
import { compareObjects } from '../../../lib/Comparison';
import { jsonToInstance } from '../../../lib/Utils';

core.Messages.importMessagesDirectory(__dirname);

const messages = core.Messages.loadMessages('sfdx-collate', 'api');

export default class CollateApi extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx collate:compare:api --metadataType PermissionSet --primary uat.All_Users --secondary prod.All_Users --mode full
        "obj","key","primary","secondary","final","change"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|application","Application1","Application1","Application1","Update"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application1^|visible","true","true","true","Update"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|application","Application2",,,"Add"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application2^|visible","false",,,"Add"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|application","Application3","Application3","Application3","Update"
        "PermissionSet","PermissionSet|applicationVisibilities|^application:Application3^|visible","false","true","true","Update"
        ...
    `
    ];

    // public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        metadatatype: flags.string({ char: 't', description: messages.getMessage('metadatatypeFlagDescription'), required: true, options: ['PermissionSet', 'Profile']}),
        primary: flags.string({ char: 'p', description: messages.getMessage('primaryFlagDescription'), required: true }),
        secondary: flags.string({ char: 's', description: messages.getMessage('secondaryFlagDescription'), required: true }),
        mode: flags.string({ char: 'm', description: messages.getMessage('modeFlagDescription'), required: false, options: ['full', 'inner', 'exact', 'diff']})
    };

    protected static requiresProject = false;

    public async run() {
        const primaryApiName: string = this.flags.primary.split('.')[1];
        const secondaryApiName: string = this.flags.secondary.split('.')[1];
        const metadataType: string = this.flags.metadatatype;

        const primaryOrg: Org = await Org.create(this.flags.primary.split('.')[0]);
        const primaryConn: Connection = await primaryOrg.getConnection();
        const primaryObj = primaryConn.metadata.read(metadataType, primaryApiName, (err, metadata) => {
            if (err) { console.error(err); }
            return metadata;
        });

        const secondaryOrg: Org = await Org.create(this.flags.secondary.split('.')[0]);
        const secondaryConn: Connection = await secondaryOrg.getConnection();
        const secondaryObj = secondaryConn.metadata.read(metadataType, secondaryApiName, (err, metadata) => {
            if (err) { console.error(err); }
            return metadata;
        });

        Promise.all([primaryObj, secondaryObj]).then(res => {
            console.log(compareObjects(jsonToInstance(res[0], metadataType), jsonToInstance(res[1], metadataType), this.flags.mode));
        }).catch();

        return null;
    }
}
