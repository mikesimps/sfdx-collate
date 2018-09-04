import { deserialize, deserializeAs, inheritSerialization, serialize, serializeAs } from 'cerialize';

export class SharedTo {
    @serialize @deserialize public allCustomerPortalUsers?: string;
    @serialize @deserialize public allInternalUsers?: string;
    @serialize @deserialize public allPartnerUsers?: string;
    @serialize @deserialize public channelProgramGroup?: string;
    @serialize @deserialize public channelProgramGroups?: string;
    @serialize @deserialize public group?: string;
    @serialize @deserialize public groups?: string;
    @serialize @deserialize public managerSubordinates?: string;
    @serialize @deserialize public managers?: string;
    @serialize @deserialize public portalRole?: string;
    @serialize @deserialize public portalRoleAndSubordinates?: string;
    @serialize @deserialize public queue?: string;
    @serialize @deserialize public role?: string;
    @serialize @deserialize public roleAndSubordinates?: string;
    @serialize @deserialize public roleAndSubordinatesInternal?: string;
    @serialize @deserialize public roles?: string;
    @serialize @deserialize public rolesAndSubordinates?: string;
    @serialize @deserialize public territories?: string;
    @serialize @deserialize public territoriesAndSubordinates?: string;
    @serialize @deserialize public territory?: string;
    @serialize @deserialize public territoryAndSubordinates?: string;

    public getKey(): string { return 'SharedTo'; }
    public getKeyValue(): string { return 'SharedTo'; }
}

enum FilterOperation {
    'equals',
    'notEqual',
    'lessThan',
    'greaterThan',
    'lessOrEqual',
    'greaterOrEqual',
    'contains',
    'notContain',
    'startsWith',
    'includes',
    'excludes',
    'within'
}

export class FilterItem {
    @serialize @deserialize public field: string;
    @serializeAs(FilterOperation) @deserializeAs(FilterOperation) public operation: FilterOperation;
    @serialize @deserialize public value: string;
    @serialize @deserialize public valueField: string;

    public getKey(): string { return 'field'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class AccountSharingRuleSettings {
    @serialize @deserialize public caseAccessLevel?: string;
    @serialize @deserialize public contactAccessLevel?: string;
    @serialize @deserialize public opportunityAccessLevel?: string;

    public getKey(): string { return 'accountSettings'; }
    public getKeyValue(): string { return 'accountSettings'; }
}

export class SharingBaseRule {
    @serialize @deserialize public accessLevel: string;
    @serializeAs(AccountSharingRuleSettings, 'accountSettings') @deserializeAs(AccountSharingRuleSettings, 'accountSettings') public accountSettings?: AccountSharingRuleSettings;
    @serialize @deserialize public description?: string;
    @serialize @deserialize public label: string;
    @serialize @deserialize public fullName: string;
    @serializeAs(SharedTo) @deserializeAs(SharedTo) public sharedTo: SharedTo;

    public getKey(): string { return 'fullName'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

@inheritSerialization(SharingBaseRule)
export class SharingOwnerRule extends SharingBaseRule {
    @serializeAs(SharedTo, 'sharedFrom') @deserializeAs(SharedTo, 'sharedFrom') public sharedFrom?: SharedTo;
}

@inheritSerialization(SharingBaseRule)
export class SharingTerritoryRule extends SharingBaseRule {
    @serializeAs(SharedTo, 'sharedFrom') @deserializeAs(SharedTo, 'sharedFrom') public sharedFrom: SharedTo;
}

@inheritSerialization(SharingBaseRule)
export class SharingCriteriaRule extends SharingBaseRule {
    @serialize @deserialize public booleanFilter: string;
    @serializeAs(FilterItem) @deserializeAs(FilterItem) public criteriaItems: FilterItem[] = new Array();
    @serializeAs(SharingOwnerRule) @deserializeAs(SharingOwnerRule) public sharingOwnerRules: SharingOwnerRule[] = new Array();
}

export class SharingRules {
    @serializeAs(SharingCriteriaRule) @deserializeAs(SharingCriteriaRule) public sharingCriteriaRules: SharingCriteriaRule[] = new Array();
    @serializeAs(SharingOwnerRule) @deserializeAs(SharingOwnerRule) public sharingOwnerRules: SharingOwnerRule[] = new Array();
    @serializeAs(SharingTerritoryRule) @deserializeAs(SharingTerritoryRule) public sharingTerritoryRules: SharingTerritoryRule[] = new Array();
}
