import { deserialize, Deserialize, serialize, Serialize } from 'cerialize';
import { toCSV, toObject } from 'csvjson';

export interface GetKeys {
    getKey(): string;
    getKeyValue(): string;
}

export class Comparison {
    @serialize @deserialize public obj: string;
    @serialize @deserialize public key: string;
    @serialize @deserialize public primary: string;
    @serialize @deserialize public secondary: string;
    @serialize @deserialize public final: string;
    @serialize @deserialize public change: string;

    constructor(obj: string, key: string, primary: string, secondary: string, final: string, change: string) {
        this.obj = obj;
        this.key = key;
        this.primary = primary;
        this.secondary = secondary;
        this.final = final;
        this.change = change;
    }
}

export function csvToComparisons(csv: string): Comparison[] {
    return Deserialize(toObject(csv, {delimiter: ',', quote: '"'}), Comparison);
}

export function comparisonsToCSV(list: Comparison[], mode?: string): string {
    let exportList: Comparison[] = [];
    switch (mode) {
         case 'inner': {
            // do not include any missing keys or values
            // exclude all "add" changes
            // finalVal = primaryVal
            list.forEach(c => {
                if ( c.change.toLowerCase() !== 'add' ) {
                    c.final = c.primary;
                    exportList.push(c);
                }
            });
            break;
         }
         case 'exact': {
            // only include items that exactly match keys and values
            // include ONLY "match" changes
            // finalVal = primaryVal
            list.forEach(c => {
                if ( c.change.toLowerCase() === 'match' ) {
                    c.final = c.primary;
                    exportList.push(c);
                }
            });
            break;
         }
         case 'diff': {
            // only include items that are different
            // include ONLY "add" or "update" changes
            // finalVal = primaryVal if not null, otherwise secondaryVal
            list.forEach(c => {
                if ( c.change.toLowerCase() === 'add' || c.change.toLowerCase() === 'update' ) {
                    c.final = c.primary === '' ? c.primary : c.secondary;
                    exportList.push(c);
                }
            });
            break;
         }
         default: {
            // Full Mode - preserve as much info as possible
            // fill in any missing items from primary or secondary
            // leave in all noted differences (either keys or values)
            // finalVal = primaryVal if not null, otherwise secondaryVal
            list.forEach(c => {
                c.final = c.primary ? c.primary : c.secondary;
            });
            exportList = list;
            break;
         }
    }
    return toCSV(comparisonsToJSON(exportList), {headers: 'relative', wrap: true});
}

export function comparisonsToJSON(list: Comparison[]): string {
    return Serialize(list);
}

export function compareObjects(primaryObj: object, secondaryObj: object, mode: string): string {
    let cmp: Comparison[] = [];
    const objectName: string = primaryObj.constructor.name;
    function traverse(obj, obj2) {
        if (typeof obj === 'object') {
            for (const p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] instanceof Array) {
                        cmp = cmp.concat(createComparisons(objectName + '|' + p, obj[p], obj2[p]));
                        traverse(obj[p], obj2[p]);
                    } else if (isNaN(Number(p))) {
                        cmp = cmp.concat(createComparisons(objectName + '|' + p, { [p]: obj[p] }, { [p]: obj2[p] }));
                    }
                }
            }
            return obj;
        }
    }
    traverse(primaryObj, secondaryObj);
    return comparisonsToCSV(cmp, mode);
}

export function createComparisons<T>(obj: string, primary?: T, secondary?: T): Comparison[];
export function createComparisons<T extends GetKeys>(obj: string, primary?: T[], secondary?: T[]): Comparison[] {
    const delta: Comparison[] = new Array();
    let path: string;
    let primaryVal: string;
    let secondaryVal: string;
    const finalVal: string = ''; // default this to empty, will be populated before output
    let change: string;
    let keyProp: string;
    let l: T;
    let r: T;
    let previousLKey: string;
    let lKey: string;
    let rKey: string;
    primary = primary === undefined ? [] : primary;
    secondary = secondary === undefined ? [] : secondary;
    const objVal: string = obj.split('|')[0];
    if (primary.length + secondary.length > 0) {
        let i = 0;
        previousLKey = ' ';
        do {
            let j = 0;
            if (primary.length > 0) {
                l = primary[i];
                if ((Object.keys(primary).length > 1 || Object.keys(l).length > 1) && typeof l !== 'string') {
                    keyProp = l.getKey();
                    lKey = l.getKeyValue();
                } else {
                    keyProp = obj.split('|')[1];
                    lKey = String(l);
                }
            } else {
                lKey = '~';
            }
            do {
                if (secondary.length > 0 ) {
                    r = secondary[j];
                    if ((Object.keys(secondary).length > 1 || Object.keys(r).length > 1) && typeof r !== 'string') {
                        keyProp = r.getKey();
                        rKey = r.getKeyValue();
                    } else {
                        keyProp = obj.split('|')[1];
                        rKey = String(r);
                    }
                } else {
                    rKey = '~';
                }
                // If primary or secondary are primative types
                if ((Object(l) !== l && l !== undefined) || Object(r) !== r) {
                    primaryVal = l === undefined ? '' : String(l);
                    secondaryVal = r === undefined ? '' : String(r);
                    path = obj;
                    if (l === r) {
                        change = 'Match';
                    } else if (primaryVal === '' || secondaryVal === '') {
                        change = 'Add';
                    } else {
                        change = 'Update';
                    }
                    delta.push(new Comparison(objVal, path, primaryVal, secondaryVal, finalVal, change));
                } else if (lKey === rKey) {
                    // Loop through each of the objects properties
                    for (const key in l) {
                        if (l.hasOwnProperty(key)) {
                            primaryVal = String(l[key]);
                            secondaryVal = String(r[key]);
                            path = obj + '|^' + keyProp + ':' + lKey + '^|' + key;
                            if (primaryVal === secondaryVal) {
                                change = 'Match';
                            } else if (!primaryVal || !secondaryVal) {
                                change = 'Add';
                            } else {
                                change = 'Update';
                            }
                            delta.push(new Comparison(objVal, path, primaryVal, secondaryVal, finalVal, change));
                        }
                    }
                } else if (previousLKey < rKey) {
                    change = 'Add';
                    if (lKey < rKey) {
                        // Add primary
                        for (const key in l) {
                            if (l.hasOwnProperty(key)) {
                                primaryVal = String(l[key]);
                                path = obj + '|^' + keyProp + ':' + lKey + '^|' + key;
                                delta.push(new Comparison(objVal, path, primaryVal, '', finalVal, change));
                            }
                        }
                        if (j === (primary.length - 1) && secondary.length > 0) {
                            // Add secondary, because there are no more primary items to loop through
                            for (const key in l) {
                                if (r.hasOwnProperty(key)) {
                                    secondaryVal = String(r[key]);
                                    path = obj + '|^' + keyProp + ':' + rKey + '^|' + key;
                                    delta.push(new Comparison(objVal, path, '', secondaryVal, finalVal, change));
                                }
                            }
                        }
                    } else if (lKey > rKey) {
                        // Add secondary
                        for (const key in r) {
                            if (r.hasOwnProperty(key)) {
                                secondaryVal = String(r[key]);
                                path = obj + '|^' + keyProp + ':' + rKey + '^|' + key;
                                delta.push(new Comparison(objVal, path, '', secondaryVal, finalVal, change));
                            }
                        }
                    }
                }
                j++;
            } while (j < secondary.length && lKey > rKey);
            previousLKey = lKey;
            i++;
        } while (i < primary.length);
        primary = [];
        secondary = [];
    } else if (primary.length + secondary.length > 0) {
        change = 'Update';
        if (primary.length >= secondary.length) { primaryVal = String(Object['values'](primary[0])[0]); }
        if (primary.length <= secondary.length) { secondaryVal = String(Object['values'](secondary)[0]); }
        if (primary.length === secondary.length && JSON.stringify(primary) === JSON.stringify(secondary)) {
            change = 'Match';
        }
        delta.push(new Comparison(objVal, obj, primaryVal, secondaryVal, finalVal, change));
    }
    return delta;
}
