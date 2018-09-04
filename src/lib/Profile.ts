import { autoserialize, autoserializeAs } from 'cerialize';
import { ApplicationVisibilities, ClassAccesses, CustomPermissions, ExternalDataSourceAccesses, FieldPermissions, ObjectPermissions, PageAccesses, RecordTypeVisibilities, TabSettings, UserPermissions } from './PermissionSet';

export class CategoryGroupVisibility {
    @autoserialize public dataCategories: string;
    @autoserialize public dataCategoryGroup: string;
    @autoserialize public visibility: categoryGroupVisibility;

    public getKey(): string { return 'dataCategories'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export enum categoryGroupVisibility {
    'ALL',
    'NONE',
    'CUSTOM'
}

export class LayoutAssignments {
    @autoserialize public layout: string;
    @autoserialize public recordType?: string;

    public getKey(): string { return 'recordType+layout'; }
    public getKeyValue(): string {
        return String((this.recordType === undefined ? 'NoRecType' : this.recordType ) + '+' + this.layout);
    }
}

export class LoginHours {
    // Profile
    @autoserialize public mondayEnd: string;
    @autoserialize public mondayStart: string;
    @autoserialize public tuesdayEnd: string;
    @autoserialize public tuesdayStart: string;
    @autoserialize public wednesdayEnd: string;
    @autoserialize public wednesdayStart: string;
    @autoserialize public thursdayEnd: string;
    @autoserialize public thursdayStart: string;
    @autoserialize public fridayEnd: string;
    @autoserialize public fridayStart: string;
    @autoserialize public saturdayEnd: string;
    @autoserialize public saturdayStart: string;
    @autoserialize public sundayEnd: string;
    @autoserialize public sundayStart: string;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class LoginIpRanges {
    @autoserialize public description: string;
    @autoserialize public endAddress: string;
    @autoserialize public startAddress: string;

    public getKey(): string { return 'description'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class ProfileActionOverrides {
    // Profile
    @autoserialize public actionName: string;
    @autoserialize public content: string;
    @autoserialize public formfactor: formFactor;
    @autoserialize public pageOrSobjectType: string;
    @autoserialize public recordType: string;
    @autoserialize('string', 'type') public paotype: string;

    public getKey(): string { return 'recordType'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export enum formFactor {
    'Small',
    'Medium',
    'Large'
}

export class Profile {
    // Unique to Profile
    @autoserialize public fullName: string;
    @autoserializeAs(CategoryGroupVisibility, 'categoryGroupVisibilities') public categoryGroupVisibilities?: CategoryGroupVisibility[];
    @autoserialize public custom?: boolean;
    @autoserialize public description?: string;
    @autoserializeAs(LayoutAssignments, 'layoutAssignments') public layoutAssignments?: LayoutAssignments[];
    @autoserializeAs(LoginHours, 'loginHours') public loginHours?: LoginHours[];
    @autoserializeAs(LoginIpRanges, 'loginIpRanges') public loginIpRanges?: LoginIpRanges[];
    @autoserializeAs(ProfileActionOverrides, 'profileActionOverrides') public profileActionOverrides?: ProfileActionOverrides[];
    @autoserialize public userLicense?: string;

    // Shared with PermissionSet
    @autoserialize public $: string;
    @autoserializeAs(ApplicationVisibilities) public applicationVisibilities?: ApplicationVisibilities[] = [];
    @autoserializeAs(ClassAccesses) public classAccesses?: ClassAccesses[] = [];
    @autoserializeAs(CustomPermissions) public customPermissions?: CustomPermissions[] = [];
    @autoserializeAs(ExternalDataSourceAccesses) public externalDataSourceAccesses?: ExternalDataSourceAccesses[] = [];
    @autoserializeAs(FieldPermissions, 'fieldPermissions') public fieldPermissions?: FieldPermissions[] = [];
    @autoserializeAs(ObjectPermissions) public objectPermissions?: ObjectPermissions[] = [];
    @autoserializeAs(PageAccesses) public pageAccesses?: PageAccesses[] = [];
    @autoserializeAs(RecordTypeVisibilities) public recordTypeVisibilities?: RecordTypeVisibilities[] = [];
    @autoserializeAs(UserPermissions) public userPermissions?: UserPermissions[] = [];
    @autoserializeAs(TabSettings, 'tabVisibilities') public tabVisibilities: TabSettings[];

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
