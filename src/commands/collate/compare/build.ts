import { core, flags, SfdxCommand } from '@salesforce/command';
import { Deserialize } from 'cerialize';
import { unflatten } from 'flat';
import * as fs from 'fs';
import { Comparison, csvToComparisons } from '../../../lib/Comparison';
import { instanceToXml, instanceTypes, sortByProperty } from '../../../lib/Utils';

core.Messages.importMessagesDirectory(__dirname);

const messages = core.Messages.loadMessages('sfdx-collate', 'build');

export default class Build extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [
      `$ sfdx collate:compare:build --file directory/comparison.csv
    `
    ];

    // public static args = [{ name: 'file' }];

    protected static flagsConfig = {
      file: flags.string({ char: 'f', description: messages.getMessage('fileFlagDescription'), required: true })
    };

    protected static requiresProject = false;

    public run() {
        const compFile: string = fs.readFileSync(this.flags.file, 'utf8');
        const comparisons: Comparison[] = csvToComparisons(compFile).sort(sortByProperty('key'));

        let cmpObjRaw = comparisons.reduce((o, key) => ({ ...o, [key.key]: key.final }), {});
        cmpObjRaw = unflatten(cmpObjRaw, { delimiter: '|'});
        const instType: string = Object.keys(cmpObjRaw)[0];
        const cmpObjNormalized: object = {};
        normalizeComparisons(cmpObjRaw[instType]);
        console.log(instanceToXml(Deserialize(cmpObjNormalized, instanceTypes[instType])));

        /**
         * @name normalizeComparisons
         * @description Recursively navigates through unflattened comparison object and removes the primary key
         *  properties.
         * @param obj
         */
        function normalizeComparisons(obj) {
          if (typeof obj === 'object') {
            for (const [property, value] of Object.entries(obj)) {
              const childProp: string = String(Object.keys(value)[0]);
              if (childProp.startsWith('^') && childProp.endsWith('^')) {
                const arr: object[] = [];
                Object.keys(obj[property]).forEach(k => { arr.push(obj[property][k]); });
                cmpObjNormalized[property] = arr.map(o => (o), {});
              } else {
                cmpObjNormalized[property] = obj[property];
                normalizeComparisons(obj[property]);
              }
            }
          }
          return obj;
        }

        return null;
    }
}
