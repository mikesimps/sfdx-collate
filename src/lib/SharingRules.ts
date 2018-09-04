import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';

export class SharedTo {
    @autoserialize public allCustomerPortalUsers?: string;
    @autoserialize public allInternalUsers?: string;
    @autoserialize public allPartnerUsers?: string;
    @autoserialize public channelProgramGroup?: string;
    @autoserialize public channelProgramGroups?: string;
    @autoserialize public group?: string;
    @autoserialize public groups?: string;
    @autoserialize public managerSubordinates?: string;
    @autoserialize public managers?: string;
    @autoserialize public portalRole?: string;
    @autoserialize public portalRoleAndSubordinates?: string;
    @autoserialize public queue?: string;
    @autoserialize public role?: string;
    @autoserialize public roleAndSubordinates?: string;
    @autoserialize public roleAndSubordinatesInternal?: string;
    @autoserialize public roles?: string;
    @autoserialize public rolesAndSubordinates?: string;
    @autoserialize public territories?: string;
    @autoserialize public territoriesAndSubordinates?: string;
    @autoserialize public territory?: string;
    @autoserialize public territoryAndSubordinates?: string;

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
    @autoserialize public field: string;
    @autoserializeAs(FilterOperation) public operation: FilterOperation;
    @autoserialize public value: string;
    @autoserialize public valueField: string;

    public getKey(): string { return 'field'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

export class AccountSharingRuleSettings {
    @autoserialize public caseAccessLevel?: string;
    @autoserialize public contactAccessLevel?: string;
    @autoserialize public opportunityAccessLevel?: string;

    public getKey(): string { return 'accountSettings'; }
    public getKeyValue(): string { return 'accountSettings'; }
}

export class SharingBaseRule {
    @autoserialize public accessLevel: string;
    @autoserializeAs(AccountSharingRuleSettings, 'accountSettings') public accountSettings?: AccountSharingRuleSettings;
    @autoserialize public description?: string;
    @autoserialize public label: string;
    @autoserialize public fullName: string;
    @autoserializeAs(SharedTo) public sharedTo: SharedTo;

    public getKey(): string { return 'fullName'; }
    public getKeyValue(): string { return String(this[this.getKey()]); }
}

@inheritSerialization(SharingBaseRule)
export class SharingOwnerRule extends SharingBaseRule {
    @autoserializeAs(SharedTo, 'sharedFrom') public sharedFrom?: SharedTo;
}

@inheritSerialization(SharingBaseRule)
export class SharingTerritoryRule extends SharingBaseRule {
    @autoserializeAs(SharedTo, 'sharedFrom') public sharedFrom: SharedTo;
}

@inheritSerialization(SharingBaseRule)
export class SharingCriteriaRule extends SharingBaseRule {
    @autoserialize public booleanFilter: string;
    @autoserializeAs(FilterItem) public criteriaItems: FilterItem[] = new Array();
    @autoserializeAs(SharingOwnerRule) public sharingOwnerRules: SharingOwnerRule[] = new Array();
}

export class SharingRules {
    @autoserialize public $: string;
    @autoserializeAs(SharingCriteriaRule) public sharingCriteriaRules: SharingCriteriaRule[] = new Array();
    @autoserializeAs(SharingOwnerRule) public sharingOwnerRules: SharingOwnerRule[] = new Array();
    @autoserializeAs(SharingTerritoryRule) public sharingTerritoryRules: SharingTerritoryRule[] = new Array();
}
