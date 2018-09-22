import { Deserialize, deserialize, Serialize, serialize } from 'cerialize';
import * as jf from 'jsonfile';
import * as xml2js from 'xml2js';
import { GetKeys } from './Comparison';
import { PermissionSet } from './Permissionset';
import { Profile } from './Profile';
import { SharingRules } from './SharingRules';

export function instanceToXml<T extends GetKeys>(inst: T): string {
    const opts = {
        rootName: (inst.constructor.name),
        xmldec: { version: '1.0', encoding: 'UTF-8' }
    };
    const builder = new xml2js.Builder(opts);
    return builder.buildObject(instanceToJson(inst));
}

export function instanceToJson<T extends GetKeys>(inst: T): string {
    return Serialize(inst);
}

export function jsonToInstance<T extends GetKeys>(json: object, mdtype: string): T {
    return normalizeObject(Deserialize(json, instanceTypes[mdtype]));
}

export function xmlToJson(xml: string): JSON {
    const primaryParser = new xml2js.Parser({ explicitArray: false });

    let obj: JSON;
    primaryParser.parseString(xml, (_err, result) => { obj = result; });
    return obj;
}

export function xmlToInstance<T extends GetKeys>(xml: string): T {
    const obj: JSON = xmlToJson(xml);
    return normalizeObject(Deserialize(obj[Object.keys(obj)[0]], instanceTypes[Object.keys(obj)[0]]));
}

/**
 * Recursively sorts all entities and arrays for easier comparison
 * @param  {} obj
 */
export function normalizeObject<T>(obj: T): T {
    if (typeof obj === 'object') {
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (obj[property] instanceof Array) {
                    obj[String(property)] = sortByKey(obj[String(property)]);
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

export const instanceTypes: object = {
    PermissionSet: (PermissionSet),
    Profile: (Profile),
    SharingRules: (SharingRules)
};

export class CollateConfig {

    @serialize @deserialize public quickFilters: string[];
    @serialize @deserialize public excludeManaged: boolean;
    @serialize @deserialize public apiVersion: string;
    @serialize @deserialize public targetDir: string;
    @serialize @deserialize public dxFormat: boolean;
    @serialize @deserialize public skipCleanup: boolean;

    constructor(fileName: string, flags: object) {
        let configs: object = {};

        if (fileName !== undefined) {
            jf.readFile(fileName, (err, obj) => {
                if (err) {
                  throw err;
                } else {
                    configs = obj; // need to add warnings/exceptions for poorly formatted files
                }
            });
        }

        // flags always take precendence over configs from file
        this.excludeManaged = flags['excludemanaged'] || configs['excludeManaged'] === true || false;
        this.apiVersion = flags['apiversion'] || configs['apiVersion'] || '43.0';
        this.quickFilters = flags['quickfilters'] ? flags['quickfilters'].split(',') : configs['quickFilters'] || [];
        this.targetDir = flags['targetdir'] || configs['targetDir'] || '.';
        this.dxFormat = flags['dxformat'] || configs['dxFormat'] === true || false;
        this.skipCleanup = flags['skipcleanup'] || configs['skipCleanup'] === true || false;
    }
}
