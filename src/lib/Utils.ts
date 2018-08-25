import { Deserialize } from 'cerialize';
import * as xml2js from 'xml2js';
import { PermissionSet } from './Permissionset';

export function xmlToJson(xml: string): JSON {
    const opts = { explicitArray: false };
    const primaryParser = new xml2js.Parser(opts);

    let obj: JSON;
    primaryParser.parseString(xml, (_err, result) => {
        obj = result;
    });

    return obj;
}

export function getClass<T extends PermissionSet>(obj: T) {
    return obj.getClass();
}

export function xmlToInstance(xml: string) {
    const obj: JSON = xmlToJson(xml);
    let inst;
    switch (Object.keys(obj)[0]) {
        case 'PermissionSet': {
            inst = Deserialize(obj[Object.keys(obj)[0]], PermissionSet);
            break;
        }
    }
    return inst;
}
