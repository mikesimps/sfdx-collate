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

export function compareObjects<T extends GetKeys>(primaryObj: T, secondaryObj: T, mode: string): string {

    const comparisons: Comparison[] = compareObject(primaryObj.constructor.name, primaryObj, secondaryObj, []);
    return comparisonsToCSV(comparisons, mode);

    /**
     * Creates all comparison objects after being fed a unique path and primitive values
     */
    function comparePrimitive(path: string, primary?: T, secondary?: T, delta?: Comparison[]): Comparison[] {
        const primaryVal = primary === undefined ? '' : String(primary);
        const secondaryVal = secondary === undefined ? '' : String(secondary);
        let change: string;
        const objVal: string = path.split('|')[0];

        if (primaryVal === secondaryVal) {
            change = 'Match';
        } else if (primaryVal === '' || secondaryVal === '') {
            change = 'Add';
        } else {
            change = 'Update';
        }

        delta.push(new Comparison(objVal, path, primaryVal, secondaryVal, '', change));
        return delta;
    }

    /**
     * Recursively parses two objects by each property and either creates a comparison record, or calls an additional parse
     * Passing an undefined object means that it is probably missing in one of the files and is added.
     */
    function compareObject(path: string, primary?: T, secondary?: T, delta?: Comparison[]): Comparison[] {
        let newPath: string;

        const p = primary === undefined ? {} : primary;
        const s = secondary === undefined ? {} : secondary;

        const keys = Object.keys(Object.assign({}, p, s));

        for (const key of keys) {
            if (p.hasOwnProperty(key) || s.hasOwnProperty(key)) {
                newPath = path + '|' + key;
                if (p[key] instanceof Array || s[key] instanceof Array) {
                    const pArr = p[key] instanceof Array ? p[key] : [p[key]];
                    const sArr = s[key] instanceof Array ? s[key] : [s[key]];
                    delta = compareArray(newPath, pArr, sArr, delta);
                } else if (typeof p[key] === 'object' || typeof s[key] === 'object') {
                    delta = compareObject(newPath, p[key], s[key], delta);
                } else {
                    delta = comparePrimitive(newPath, p[key], s[key], delta);
                }
            }
        }
        return delta;
    }

    /**
     * Recursively parses and compares the objects from two arrays by the unique key specified by getKey
     * If an the objects match on their keys, they are compared to each other. If it is determined that
     * an object is unique for the array, it is compared with undefined (net new object)
     *
     * A map is used to ensure that only unique keys between the two arrays are processed (no duplicates)
     */
    function compareArray(path: string, primary?: T[], secondary?: T[], delta?: Comparison[]): Comparison[] {
        let keyProp: string;
        let pKey: string;
        let sKey: string;
        let newPath: string = path;
        let p: T;
        let s: T;

        primary = primary === undefined ? [] : primary;
        secondary = secondary === undefined ? [] : secondary;

        const compMap: Map<string, [string, string, T, T]> = new Map();
        if (primary.length + secondary.length > 0) {
            let i: number = 0;
            while (i < primary.length) {
                let j: number = 0;
                p = primary[i];
                while (j < secondary.length) {
                    s = secondary[j];
                    if ((p !== undefined && Object(p) !== p) || (s !== undefined && Object(s) !== s)) {
                        delta = comparePrimitive(path, p, s, delta);
                    } else if (typeof p === 'object' || typeof s === 'object') {

                        if (primary !== undefined && p !== undefined) {
                            keyProp = p.getKey();
                            pKey = p.getKeyValue();
                        } else {
                            pKey = ' '; // ASCII #126
                        }

                        if (secondary !== undefined && s !== undefined) {
                            keyProp = s.getKey();
                            sKey = s.getKeyValue();
                        } else {
                            sKey = ' '; // ASCII #126
                        }

                        newPath = path + '|^' + keyProp + ':';
                        if (pKey === sKey) {
                            compMap.set(newPath + pKey + '^', ['object', newPath + pKey + '^', p, s]);
                        } else if (pKey > sKey) {
                            if (!compMap.has(newPath + pKey + '^')) {
                                compMap.set(newPath + pKey + '^', ['object', newPath + pKey + '^', p, undefined]);
                            }
                        } else if (pKey < sKey) {
                            if (!compMap.has(newPath + sKey + '^')) {
                                compMap.set(newPath + sKey + '^', ['object', newPath + sKey + '^', undefined, s]);
                            }
                        }
                    }
                    j++;
                }
                i++;
            }

            compMap.forEach(m => {
                switch (m[0]) {
                    case 'array':
                        delta = compareArray(m[1], [m[2]], [m[3]], delta);
                        break;
                    case 'object':
                        delta = compareObject(m[1], m[2], m[3], delta);
                        break;
                    default:
                        delta = comparePrimitive(m[1], m[2], m[3], delta);
                        break;
                }
            });
        }
        return delta;
    }
}
