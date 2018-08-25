
import { PermissionSet, ApplicationVisibilities, UserPermissions } from '../sfdx-collate/src/commands/collate/lib/Permissionset';
import { Comparison, comparisonsToCSV, compareObjects, normalizeObject } from '../sfdx-collate/src/commands/collate/lib/Comparison';

const av: ApplicationVisibilities[] = [];
av.push(new ApplicationVisibilities('xyz', true));
av.push(new ApplicationVisibilities('123', true));
av.push(new ApplicationVisibilities('abc', true));

const up: UserPermissions[] = [];
up.push(new UserPermissions(true, 'joe'));
up.push(new UserPermissions(true, 'mike'));
up.push(new UserPermissions(false, 'zed'));

const av2: ApplicationVisibilities[] = [];
av2.push(new ApplicationVisibilities('abc', true));
av2.push(new ApplicationVisibilities('yyz', true));
av2.push(new ApplicationVisibilities('lmn', true));

const up2: UserPermissions[] = [];
up2.push(new UserPermissions(true, 'joe'));
up2.push(new UserPermissions(true, 'mikes'));
up2.push(new UserPermissions(false, 'jane'));

const ps = normalizeObject(new PermissionSet('abc', 'adescription', av, up));
const ps2 = normalizeObject(new PermissionSet('xyz', '' , av2, up2));

let cmp: Comparison[] = [];
const objectName: string = ps.constructor.name;

function process(obj, obj2) {
    if ( typeof obj === 'object') {
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] instanceof Array) {
                    cmp = cmp.concat(compareObjects(objectName + '|' + p, obj[p], obj2[p], 'left'));
                    process(obj[p], obj2[p]);
                } else if (isNaN(Number(p))) {
                    cmp = cmp.concat(compareObjects(objectName + '|' + p, {[p]: obj[p]}, {[p]: obj2[p]}, 'left'));
                }
            }
        }
        return obj;
    }
}

process(ps, ps2);
console.log(comparisonsToCSV(cmp));
