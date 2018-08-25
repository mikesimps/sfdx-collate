import { deserialize, Deserialize, deserializeAs, serialize, Serialize, serializeAs } from 'cerialize';
import { toObject } from 'csvjson';
import { parse } from 'json2csv';

export interface GetKeyValue {
    getKey(): string;
    getKeyValue(): string;
}

export class Comparison {
    @serialize @deserialize public obj: string;
    @serialize @deserialize public key: string; //
    @serialize @deserialize public left: string; // Map<string, object>;
    @serialize @deserialize public right: string; // Map<string, object>;
    @serialize @deserialize public primary: string;
    @serialize @deserialize public change: string;
    public leftObj: object;
    public rightObj: object;

    constructor(obj?: string, key?: string, left?: string, right?: string, primary?: string, change?: string, leftObj?: object, rightObj?: object) {
        this.obj = obj;
        this.key = key;
        this.left = left;
        this.right = right;
        this.primary = primary;
        this.change = change;
        this.leftObj = leftObj;
        this.rightObj = rightObj;
    }
}

export function csvToComparisons(csv: string): Comparison[] {
    return Deserialize(toObject(csv, {delimiter: ',', quote: '"'}), Comparison);
}

export function comparisonsToCSV(list: Comparison[]): string {
    // const fields = ['Object', 'Key', 'Left Value', 'Right Value', 'Primary', 'Change', 'Left Object', 'Right Object'];
    return parse(comparisonsToJSON(list));
}

export function comparisonsToJSON(list: Comparison[]): string {
    // return Object.assign({}, ...list);
    return Serialize(list);
}

export function compareObjects(primaryObj: object, secondaryObj: object): string {
    let cmp: Comparison[] = [];
    const objectName: string = primaryObj.constructor.name;
    function traverse(obj, obj2) {
        if (typeof obj === 'object') {
            for (const p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] instanceof Array) {
                        cmp = cmp.concat(createComparisons(objectName + '|' + p, obj[p], obj2[p], 'left'));
                        traverse(obj[p], obj2[p]);
                    } else if (isNaN(Number(p))) {
                        cmp = cmp.concat(createComparisons(objectName + '|' + p, { [p]: obj[p] }, { [p]: obj2[p] }, 'left'));
                    }
                }
            }
            return obj;
        }
    }
    traverse(primaryObj, secondaryObj);
    return comparisonsToCSV(cmp);
}

export function createComparisons<T>(obj: string, left?: T, right?: T, primary?: string): Comparison[];
export function createComparisons<T extends GetKeyValue>(obj: string, left?: T[], right?: T[], primary?: string): Comparison[] {
    const delta: Comparison[] = new Array();
    let path: string;
    let leftVal: string;
    let rightVal: string;
    let change: string;
    let keyProp: string;
    let l: T;
    let r: T;
    let previousLKey: string;
    let lKey: string;
    let rKey: string;
    const objVal: string = obj.split('|')[0];
    if (left.length + right.length > 0) {
        let i = 0;
        previousLKey = ' ';
        do {
            let j = 0;
            if (left.length > 0) {
                l = left[i];
                if ((Object.keys(left).length > 1 || Object.keys(l).length > 1) && typeof l !== 'string') {
                    keyProp = l.getKey();
                    lKey = l.getKeyValue();
                } else {
                    keyProp = obj.split('|')[1];
                    lKey = l;
                }
            } else {
                lKey = '~';
            }
            let matched = false;
            do {
                if (right.length > 0 ) {
                    r = right[j];
                    if ((Object.keys(right).length > 1 || Object.keys(r).length > 1) && typeof r !== 'string') {
                        keyProp = r.getKey();
                        rKey = r.getKeyValue();
                    } else {
                        keyProp = obj.split('|')[1];
                        rKey = String(r);
                    }
                } else {
                    rKey = '~';
                }
                // If left or right are primative types
                if ((Object(l) !== l && l !== undefined) || Object(r) !== r) {
                    leftVal = String(l);
                    rightVal = String(r);
                    path = obj;
                    // If the property value matches
                    if (l === r) {
                        change = 'Match';
                    } else if (!leftVal || !rightVal) {
                        change = 'Add';
                    } else {
                        change = 'Update';
                    }
                    delta.push(new Comparison(objVal, path, leftVal, rightVal, primary, change, l, r));
                } else if (lKey === rKey) {
                    matched = true;
                    // Loop through each of the objects properties
                    for (const key in l) {
                        if (l.hasOwnProperty(key)) {
                            leftVal = String(l[key]);
                            rightVal = String(r[key]);
                            path = obj + '|^' + l[keyProp] + '^|' + key;
                            // If the property value matches
                            if (l[key] === r[key]) {
                                change = 'Match';
                            } else if (!leftVal || !rightVal) {
                                change = 'Add';
                            } else {
                                change = 'Update';
                            }
                            delta.push(new Comparison(objVal, path, leftVal, rightVal, primary, change, l, r));
                        }
                    }
                } else if (previousLKey < rKey) {
                    change = 'Add';
                    if (lKey < rKey) {
                        // Add Left
                        for (const key in l) {
                            if (l.hasOwnProperty(key)) {
                                leftVal = String(l[key]);
                                path = obj + '|^' + l[keyProp] + '^|' + key;
                                delta.push(new Comparison(objVal, path, leftVal, '', primary, change, l, {}));
                            }
                        }
                        if (j === (left.length - 1) && right.length > 0) {
                            // Add Right, because there are no more left items to loop through
                            for (const key in l) {
                                if (r.hasOwnProperty(key)) {
                                    rightVal = String(r[key]);
                                    path = obj + '|^' + r[keyProp] + '^|' + key;
                                    delta.push(new Comparison(objVal, path, '', rightVal, primary, change, {}, r));
                                }
                            }
                        }
                    } else if (lKey > rKey) {
                        // Add Right
                        for (const key in r) {
                            if (r.hasOwnProperty(key)) {
                                rightVal = String(r[key]);
                                path = obj + '|^' + r[keyProp] + '^|' + key;
                                delta.push(new Comparison(objVal, path, '', rightVal, primary, change, {}, r));
                            }
                        }
                    }
                }
                j++;
            } while (j < right.length && lKey > rKey);
            previousLKey = lKey;
            i++;
        } while (i < left.length);
        left = [];
        right = [];
    } else if (left.length + right.length > 0) {
        change = 'Update';
        if (left.length >= right.length) {
            leftVal = String(Object['values'](left[0])[0]);
        }
        if (left.length <= right.length) {
            rightVal = String(Object['values'](right)[0]);
        }
        if (left.length === right.length && JSON.stringify(left) === JSON.stringify(right)) {
            change = 'Match';
        }
        delta.push(new Comparison(objVal, obj, leftVal, rightVal, primary, change, left, right));
    }
    return delta;
}

/**
 * Recursively sorts all entities and arrays for easier comparison
 * @param  {} obj
 */
export function normalizeObject(obj) {
    if (typeof obj === 'object') {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (obj[property] instanceof Array) {
                    obj[property] = sortByKey(obj[property]);
                }
                normalizeObject(obj[property]);
            }
        }
        return obj;
    }
}

function sortByKey<T extends GetKeyValue>(objs: T[]): T[] {
    return (objs.length > 1) ? objs.sort(sortByProperty(objs[0].getKey())) : objs;
}

export function sortByProperty(property) {
    return (x, y) => {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
}
