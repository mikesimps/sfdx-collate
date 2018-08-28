import { deserialize, deserializeAs, serialize, serializeAs } from 'cerialize';
import { GetKeys } from './Comparison';

export class ApplicationVisibilities implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public application: string; // key
    @serialize @deserialize public visible: boolean;
    @serializeAs('default') @deserializeAs('default') public defaultval: boolean; // profile only

    public getKey(): string { return 'application'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ClassAccesses {
    // Profile and PermissionSet
    @serialize @deserialize public apexClass: string;
    @serialize @deserialize public enabled: boolean;

    public getKey(): string { return 'apexClass'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class CustomPermissions implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public name: string;

    public getKey(): string { return 'name'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ExternalDataSourceAccesses implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public externalDataSource: string;

    public getKey(): string { return 'externalDataSource'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class FieldPermissions implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public editable: boolean;
    @serialize @deserialize public field: string;
    @serialize @deserialize public readable: boolean;

    public getKey(): string { return 'field'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ObjectPermissions implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public object?: string; // key
    @serialize @deserialize public allowCreate?: boolean;
    @serialize @deserialize public allowDelete?: boolean;
    @serialize @deserialize public allowEdit?: boolean;
    @serialize @deserialize public allowRead?: boolean;
    @serialize @deserialize public modifyAllRecords?: boolean;
    @serialize @deserialize public viewAllRecords?: boolean;

    public getKey(): string { return 'object'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class PageAccesses implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public apexPage: string;
    @serialize @deserialize public enabled: boolean;

    public getKey(): string { return 'apexPage'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class RecordTypeVisibilities implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public recordType: string;
    @serialize @deserialize public visible: boolean;

    // Profile
    @serialize @deserialize public defaultval: string;
    @serialize @deserialize public personAccountDefault: boolean;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class TabSettings implements GetKeys {
    // Profile (known as TablVisibilities) and PermissionSet
    @serialize @deserialize public tab: string;
    @serialize @deserialize public visibility: TabVisibility;

    public getKey(): string { return 'tab'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export const tabVisibility = {
    None: true,
    Available: true,
    Visible: true
};

type TabVisibility = keyof typeof tabVisibility;

export class UserPermissions implements GetKeys {
    // Profile and PermissionSet
    @serialize @deserialize public enabled: boolean;
    @serialize @deserialize public name: string;

    public getKey(): string { return 'name'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class PermissionSet implements GetKeys {
    @serializeAs(ApplicationVisibilities) @deserializeAs(ApplicationVisibilities) public applicationVisibilities?: ApplicationVisibilities[] = [];
    @serialize @deserialize public $: string;
    @serializeAs(ClassAccesses) @deserializeAs(ClassAccesses) public classAccesses?: ClassAccesses[] = [];
    @serializeAs(CustomPermissions) @deserializeAs(CustomPermissions) public customPermissions?: CustomPermissions[] = [];
    @serialize @deserialize public description?: string;
    @serializeAs(ExternalDataSourceAccesses) @deserializeAs(ExternalDataSourceAccesses) public externalDataSourceAccesses?: ExternalDataSourceAccesses[] = [];
    @serializeAs(FieldPermissions, 'fieldPermissions') @deserializeAs(FieldPermissions, 'fieldPermissions') public fieldPermissions?: FieldPermissions[] = [];
    @serialize @deserialize public hasActivationRequired?: boolean;
    @serialize @deserialize public label: string;
    @serialize @deserialize public license?: string;
    @serializeAs(ObjectPermissions) @deserializeAs(ObjectPermissions) public objectPermissions?: ObjectPermissions[] = [];
    @serializeAs(PageAccesses) @deserializeAs(PageAccesses) public pageAccesses?: PageAccesses[] = [];
    @serializeAs(RecordTypeVisibilities) @deserializeAs(RecordTypeVisibilities) public recordTypeVisibilities?: RecordTypeVisibilities[] = [];
    @serializeAs(TabSettings) @deserializeAs(TabSettings) public tabSettings?: TabSettings[] = [];
    @serializeAs(UserPermissions) @deserializeAs(UserPermissions) public userPermissions?: UserPermissions[] = [];

    public getKey(): string { return 'label'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

/* From Salesforce XSD for Reference
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
