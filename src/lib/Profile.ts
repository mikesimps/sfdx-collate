import { deserialize, deserializeAs, serialize, serializeAs } from 'cerialize';
import { GetKeys } from './Comparison';
import { ApplicationVisibilities, ClassAccesses, CustomPermissions, ExternalDataSourceAccesses, FieldPermissions, ObjectPermissions, PageAccesses, RecordTypeVisibilities, TabSettings, UserPermissions } from './PermissionSet';

export class CategoryGroupVisibility implements GetKeys {
    @serialize @deserialize public dataCategories: string;
    @serialize @deserialize public dataCategoryGroup: string;
    @serialize @deserialize public visibility: categoryGroupVisibility;

    public getKey(): string { return 'dataCategories'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export enum categoryGroupVisibility {
    'ALL',
    'NONE',
    'CUSTOM'
}

export class LayoutAssignments implements GetKeys {
    @serialize @deserialize public layout: string;
    @serialize @deserialize public recordType?: string;

    public getKey(): string { return 'recordType+layout'; }
    public getKeyValue(): string {
        return String((this.recordType === undefined ? 'NoRecType' : this.recordType ) + '+' + this.layout);
    }
}

export class LoginHours implements GetKeys {
    // Profile
    @serialize @deserialize public mondayEnd: string;
    @serialize @deserialize public mondayStart: string;
    @serialize @deserialize public tuesdayEnd: string;
    @serialize @deserialize public tuesdayStart: string;
    @serialize @deserialize public wednesdayEnd: string;
    @serialize @deserialize public wednesdayStart: string;
    @serialize @deserialize public thursdayEnd: string;
    @serialize @deserialize public thursdayStart: string;
    @serialize @deserialize public fridayEnd: string;
    @serialize @deserialize public fridayStart: string;
    @serialize @deserialize public saturdayEnd: string;
    @serialize @deserialize public saturdayStart: string;
    @serialize @deserialize public sundayEnd: string;
    @serialize @deserialize public sundayStart: string;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class LoginIpRanges implements GetKeys {
    @serialize @deserialize public description: string;
    @serialize @deserialize public endAddress: string;
    @serialize @deserialize public startAddress: string;

    public getKey(): string { return 'description'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ProfileActionOverrides implements GetKeys {
    // Profile
    @serialize @deserialize public actionName: string;
    @serialize @deserialize public content: string;
    @serialize @deserialize public formfactor: formFactor;
    @serialize @deserialize public pageOrSobjectType: string;
    @serialize @deserialize public recordType: string;
    @serializeAs('type') @deserializeAs('type') public paotype: string;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export enum formFactor {
    'Small',
    'Medium',
    'Large'
}

export class Profile implements GetKeys {
    // Unique to Profile
    @serialize @deserialize public fullName: string;
    @serializeAs(CategoryGroupVisibility, 'categoryGroupVisibilities') @deserializeAs(CategoryGroupVisibility, 'categoryGroupVisibilities') public categoryGroupVisibilities?: CategoryGroupVisibility[];
    @serialize @deserialize public custom?: boolean;
    @serialize @deserialize public description?: string;
    @serializeAs(LayoutAssignments, 'layoutAssignments') @deserializeAs(LayoutAssignments, 'layoutAssignments') public layoutAssignments?: LayoutAssignments[];
    @serializeAs(LoginHours, 'loginHours') @deserializeAs(LoginHours, 'loginHours') public loginHours?: LoginHours[];
    @serializeAs(LoginIpRanges, 'loginIpRanges') @deserializeAs(LoginIpRanges, 'loginIpRanges') public loginIpRanges?: LoginIpRanges[];
    @serializeAs(ProfileActionOverrides, 'profileActionOverrides') @deserializeAs(ProfileActionOverrides, 'profileActionOverrides') public profileActionOverrides?: ProfileActionOverrides[];
    @serialize @deserialize public userLicense?: string;

    // Shared with PermissionSet
    @serialize @deserialize public $: string;
    @serializeAs(ApplicationVisibilities) @deserializeAs(ApplicationVisibilities) public applicationVisibilities?: ApplicationVisibilities[] = [];
    @serializeAs(ClassAccesses) @deserializeAs(ClassAccesses) public classAccesses?: ClassAccesses[] = [];
    @serializeAs(CustomPermissions) @deserializeAs(CustomPermissions) public customPermissions?: CustomPermissions[] = [];
    @serializeAs(ExternalDataSourceAccesses) @deserializeAs(ExternalDataSourceAccesses) public externalDataSourceAccesses?: ExternalDataSourceAccesses[] = [];
    @serializeAs(FieldPermissions, 'fieldPermissions') @deserializeAs(FieldPermissions, 'fieldPermissions') public fieldPermissions?: FieldPermissions[] = [];
    @serializeAs(ObjectPermissions) @deserializeAs(ObjectPermissions) public objectPermissions?: ObjectPermissions[] = [];
    @serializeAs(PageAccesses) @deserializeAs(PageAccesses) public pageAccesses?: PageAccesses[] = [];
    @serializeAs(RecordTypeVisibilities) @deserializeAs(RecordTypeVisibilities) public recordTypeVisibilities?: RecordTypeVisibilities[] = [];
    @serializeAs(UserPermissions) @deserializeAs(UserPermissions) public userPermissions?: UserPermissions[] = [];
    @serializeAs(TabSettings, 'tabVisibilities') @deserializeAs(TabSettings, 'tabVisibilities') public tabVisibilities: TabSettings[];

    public getKey(): string { return 'fullName'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

// <xsd:element name="applicationVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileApplicationVisibility"/>
// <xsd:element name="categoryGroupVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileCategoryGroupVisibility"/>
// <xsd:element name="classAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileApexClassAccess"/>
// <xsd:element name="custom" minOccurs="0" type="xsd:boolean"/>
// <xsd:element name="customPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileCustomPermissions"/>
// <xsd:element name="description" minOccurs="0" type="xsd:string"/>
// <xsd:element name="externalDataSourceAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileExternalDataSourceAccess"/>
// <xsd:element name="fieldPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileFieldLevelSecurity"/>
// <xsd:element name="layoutAssignments" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileLayoutAssignment"/>
// <xsd:element name="loginHours" minOccurs="0" type="tns:ProfileLoginHours"/>
// <xsd:element name="loginIpRanges" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileLoginIpRange"/>
// <xsd:element name="objectPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileObjectPermissions"/>
// <xsd:element name="pageAccesses" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileApexPageAccess"/>
// <xsd:element name="profileActionOverrides" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileActionOverride"/>
// <xsd:element name="recordTypeVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileRecordTypeVisibility"/>
// <xsd:element name="tabVisibilities" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileTabVisibility"/>
// <xsd:element name="userLicense" minOccurs="0" type="xsd:string"/>
// <xsd:element name="userPermissions" minOccurs="0" maxOccurs="unbounded" type="tns:ProfileUserPermission"/>
