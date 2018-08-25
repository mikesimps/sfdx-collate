import { Deserialize } from 'cerialize';
import * as xml2js from 'xml2js';
import { PermissionSet } from './Permissionset';

export function xmlToJson(xml: string): JSON {
    const opts = { explicitArray: false };
    // const primaryParser = new xml2js.Parser(opts);
    const primaryParser = new xml2js.Parser();

    let obj: JSON;
    primaryParser.parseString(xml, (_err, result) => {
        obj = result;
    });
    console.log(obj);
    return obj;
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
