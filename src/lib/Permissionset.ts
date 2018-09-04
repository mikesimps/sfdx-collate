import { autoserialize, autoserializeAs } from 'cerialize';

export class ApplicationVisibilities {
    // Profile and PermissionSet
    @autoserialize public application: string; // key
    @autoserialize public visible: boolean;
    @autoserializeAs('default') public defaultval: boolean; // profile only

    public getKey(): string { return 'application'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ClassAccesses {
    // Profile and PermissionSet
    @autoserialize public apexClass: string;
    @autoserialize public enabled: boolean;

    public getKey(): string { return 'apexClass'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class CustomPermissions {
    // Profile and PermissionSet
    @autoserialize public enabled: boolean;
    @autoserialize public name: string;

    public getKey(): string { return 'name'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ExternalDataSourceAccesses {
    // Profile and PermissionSet
    @autoserialize public enabled: boolean;
    @autoserialize public externalDataSource: string;

    public getKey(): string { return 'externalDataSource'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class FieldPermissions {
    // Profile and PermissionSet
    @autoserialize public editable: boolean;
    @autoserialize public field: string;
    @autoserialize public readable: boolean;

    public getKey(): string { return 'field'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ObjectPermissions {
    // Profile and PermissionSet
    @autoserialize public object?: string; // key
    @autoserialize public allowCreate?: boolean;
    @autoserialize public allowDelete?: boolean;
    @autoserialize public allowEdit?: boolean;
    @autoserialize public allowRead?: boolean;
    @autoserialize public modifyAllRecords?: boolean;
    @autoserialize public viewAllRecords?: boolean;

    public getKey(): string { return 'object'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class PageAccesses {
    // Profile and PermissionSet
    @autoserialize public apexPage: string;
    @autoserialize public enabled: boolean;

    public getKey(): string { return 'apexPage'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class RecordTypeVisibilities {
    // Profile and PermissionSet
    @autoserialize public recordType: string;
    @autoserialize public visible: boolean;

    // Profile
    @autoserialize public defaultval: string;
    @autoserialize public personAccountDefault: boolean;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class TabSettings {
    // Profile (known as TablVisibilities) and PermissionSet
    @autoserialize public tab: string;
    @autoserializeAs('TabVisibility') public visibility: TabVisibility;

    public getKey(): string { return 'tab'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export const tabVisibility = {
    None: true,
    Available: true,
    Visible: true
};

type TabVisibility = keyof typeof tabVisibility;

export class UserPermissions {
    // Profile and PermissionSet
    @autoserialize public enabled: boolean;
    @autoserialize public name: string;

    public getKey(): string { return 'name'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class PermissionSet {
    @autoserializeAs(ApplicationVisibilities) public applicationVisibilities?: ApplicationVisibilities[] = [];
    @autoserialize public $: string;
    @autoserializeAs(ClassAccesses) public classAccesses?: ClassAccesses[] = [];
    @autoserializeAs(CustomPermissions) public customPermissions?: CustomPermissions[] = [];
    @autoserialize public description?: string;
    @autoserializeAs(ExternalDataSourceAccesses) public externalDataSourceAccesses?: ExternalDataSourceAccesses[] = [];
    @autoserializeAs(FieldPermissions, 'fieldPermissions') public fieldPermissions?: FieldPermissions[] = [];
    @autoserialize public hasActivationRequired?: boolean;
    @autoserialize public label: string;
    @autoserialize public license?: string;
    @autoserializeAs(ObjectPermissions) public objectPermissions?: ObjectPermissions[] = [];
    @autoserializeAs(PageAccesses) public pageAccesses?: PageAccesses[] = [];
    @autoserializeAs(RecordTypeVisibilities) public recordTypeVisibilities?: RecordTypeVisibilities[] = [];
    @autoserializeAs(TabSettings) public tabSettings?: TabSettings[] = [];
    @autoserializeAs(UserPermissions) public userPermissions?: UserPermissions[] = [];

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
