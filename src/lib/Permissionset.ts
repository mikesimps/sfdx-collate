import { deserialize, deserializeAs, serialize, serializeAs } from 'cerialize';
import { GetKeyValue } from './Comparison';

export class ApplicationVisibilities implements GetKeyValue {
    @serialize @deserialize public application: string; // key
    @serialize @deserialize public visible: boolean;

    constructor(application?: string, visible?: boolean) {
        this.application = application;
        this.visible = visible;
    }

    public getKey(): string { return 'application'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

class ClassAccesses implements GetKeyValue {
    @serialize @deserialize public apexClass: string;
    @serialize @deserialize public enabled: boolean;

    public getKey(): string {
        return 'apexClass';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class CustomPermissions {
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public name: string;

    public getKey(): string {
        return 'name';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class ExternalDataSourceAccesses implements GetKeyValue {
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public externalDataSource: string;

    public getKey(): string {
        return 'externalDataSource';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class FieldPermissions implements GetKeyValue {
    @serialize @deserialize public editable: boolean;
    @serialize @deserialize public field: string;
    @serialize @deserialize public readable: boolean;

    public getKey(): string {
        return 'field';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class ObjectPermissions implements GetKeyValue {
    @serialize @deserialize public object?: string; // key
    @serialize @deserialize public allowCreate?: boolean;
    @serialize @deserialize public allowDelete?: boolean;
    @serialize @deserialize public allowEdit?: boolean;
    @serialize @deserialize public allowRead?: boolean;
    @serialize @deserialize public modifyAllRecords?: boolean;
    @serialize @deserialize public viewAllRecords?: boolean;

    constructor(object: string, allowCreate?: boolean, allowDelete?: boolean, allowEdit?: boolean, allowRead?: boolean,  modifyAllRecords?: boolean, viewAllRecords?: boolean) {
        this.object = object;
        this.allowCreate = allowCreate;
        this.allowDelete = allowDelete;
        this.allowEdit = allowEdit;
        this.allowRead = allowRead;
        this.modifyAllRecords = modifyAllRecords;
        this.viewAllRecords = viewAllRecords;
    }

    public getKey(): string {
        return 'object';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class PageAccesses implements GetKeyValue {
    @serialize @deserialize public apexPage: string;
    @serialize @deserialize public enabled: boolean;

    public getKey(): string {
        return 'apexPage';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class RecordTypeVisibilities implements GetKeyValue {
    @serialize @deserialize public recordType: string;
    @serialize @deserialize public visible: boolean;

    public getKey(): string {
        return 'recordType';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

class TabSettings implements GetKeyValue {
    @serialize @deserialize public tab: string;
    @serialize @deserialize public visibility: TabVisibility;

    public getKey(): string {
        return 'tab';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

export const tabVisibility = {
    None: true,
    Available: true,
    Visible: true
};

type TabVisibility = keyof typeof tabVisibility;

export class UserPermissions implements GetKeyValue {
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public name: string;

    constructor(enabled?: boolean, name?: string) {
        this.enabled = enabled;
        this.name = name;
    }

    public getKey(): string {
        return 'name';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

/*
<xsd:element name="applicationVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetApplicationVisibility"/>
<xsd:element name="classAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetApexClassAccess"/>
<xsd:element name="customPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetCustomPermissions"/>
<xsd:element name="description" minOccurs="0" type="xsd:string"/>
<xsd:element name="externalDataSourceAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetExternalDataSourceAccess"/>
<xsd:element name="fieldPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetFieldPermissions"/>
<xsd:element name="hasActivationRequired" minOccurs="0" type="xsd:boolean"/>
<xsd:element name="label" type="xsd:string"/>
<xsd:element name="license" minOccurs="0" type="xsd:string"/>
<xsd:element name="objectPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetObjectPermissions"/>
<xsd:element name="pageAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetApexPageAccess"/>
<xsd:element name="recordTypeVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetRecordTypeVisibility"/>
<xsd:element name="tabSettings" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetTabSetting"/>
<xsd:element name="userPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:PermissionSetUserPermission"/>
*/

export class PermissionSet implements GetKeyValue {
    @serializeAs(ApplicationVisibilities) @deserializeAs(ApplicationVisibilities) public applicationVisibilities?: ApplicationVisibilities[] = [];
    @serialize @deserialize public $: string;
    @serializeAs(ClassAccesses) @deserializeAs(ClassAccesses) public classAccesses?: ClassAccesses[] = [];
    @serializeAs(CustomPermissions) @deserializeAs(CustomPermissions) public customPermissions?: CustomPermissions[] = [];
    @serialize @deserialize public description?: string;
    @serializeAs(ExternalDataSourceAccesses) @deserializeAs(ExternalDataSourceAccesses) public externalDataSourceAccesses?: ExternalDataSourceAccesses[] = [];
    @serializeAs(FieldPermissions) @deserializeAs(FieldPermissions, 'fieldPermissions') public fieldPermissions?: FieldPermissions[] = [];
    @serialize @deserialize public hasActivationRequired?: boolean;
    @serialize @deserialize public label: string;
    @serialize @deserialize public license?: string;
    @serializeAs(ObjectPermissions) @deserializeAs(ObjectPermissions) public objectPermissions?: ObjectPermissions[] = [];
    @serializeAs(PageAccesses) @deserializeAs(PageAccesses) public pageAccesses?: PageAccesses[] = [];
    @serializeAs(RecordTypeVisibilities) @deserializeAs(RecordTypeVisibilities) public recordTypeVisibilities?: RecordTypeVisibilities[] = [];
    @serializeAs(TabSettings) @deserializeAs(TabSettings) public tabSettings?: TabSettings[] = [];
    @serializeAs(UserPermissions) @deserializeAs(UserPermissions) public userPermissions?: UserPermissions[] = [];

    constructor(label?: string, description?: string, applicationVisibilities?: ApplicationVisibilities[], userPermissions?: UserPermissions[]) {
        this.label = label;
        this.applicationVisibilities = applicationVisibilities;
        this.userPermissions = userPermissions;
        this.description = description;
    }

    public getKey(): string {
        return 'label';
    }

    public getKeyValue(): string {
        return String(this[this.getKey()]);
    }
}

// const example = '{"PermissionSet":{"$":{"xmlns":"http://soap.sforce.com/2006/04/metadata"},"fieldPermissions":[{"editable":"false","field":"DetailedReportItem__x.Client_Name__c","readable":"true"},{"editable":"false","field":"DetailedReportItem__x.Duration__c","readable":"true"},{"editable":"false","field":"DetailedReportItem__x.End_Time__c","readable":"true"},{"editable":"false","field":"DetailedReportItem__x.Project_Id__c","readable":"true"},{"editable":"false","field":"DetailedReportItem__x.Project_Name__c","readable":"true"},{"editable":"false","field":"DetailedReportItem__x.Start_Time__c","readable":"true"}],"hasActivationRequired":"false","label":"Toggl Users","objectPermissions":{"allowCreate":"false","allowDelete":"false","allowEdit":"false","allowRead":"true","modifyAllRecords":"false","object":"DetailedReportItem__x","viewAllRecords":"false"}}}';
// const p: PermissionSet = Deserialize(JSON.parse(example).PermissionSet, PermissionSet);
// console.log(p);
// const s: JSON = Serialize(p);
// console.log(s);
