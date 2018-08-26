import { Deserialize, Serialize } from 'cerialize';
import * as xml2js from 'xml2js';
import { GetKeys } from './Comparison';
import { PermissionSet } from './Permissionset';

export function instanceToXml<T>(inst: T): string {
    const opts = {
        rootName: (inst.constructor.name),
        xmldec: { version: '1.0', encoding: 'UTF-8' }
    };
    const builder = new xml2js.Builder(opts);
    return builder.buildObject(instanceToJson(inst));
}

export function instanceToJson<T>(inst: T): string {
    return Serialize(inst);
}

export function xmlToJson(xml: string): JSON {
    const primaryParser = new xml2js.Parser();

    let obj: JSON;
    primaryParser.parseString(xml, (_err, result) => { obj = result; });
    return obj;
}

export function xmlToInstance(xml: string) {
    const obj: JSON = xmlToJson(xml);
    let inst;
    switch (Object.keys(obj)[0]) {
        case 'PermissionSet': {
            inst = normalizeObject(Deserialize(obj[Object.keys(obj)[0]], PermissionSet));
            break;
        }
        // for later implementation
        // case 'Profile': {
        //     inst = normalizeObject(Deserialize(obj[Object.keys(obj)[0]], Profile));
        //     break;
        // }
        // case 'SharingRule': {
        //     inst = normalizeObject(Deserialize(obj[Object.keys(obj)[0]], SharingRule));
        //     break;
        // }
    }
    return inst;
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

function sortByKey<T extends GetKeys>(objs: T[]): T[] {
    return (objs.length > 1) ? objs.sort(sortByProperty(objs[0].getKey())) : objs;
}

export function sortByProperty(property) {
    return (x, y) => {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
}

export const instanceTypes = {
    PermissionSet: (PermissionSet)
};
