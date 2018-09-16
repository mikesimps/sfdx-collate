import { Connection } from '@salesforce/core';
import * as jf from 'jsonfile';
import * as convert from 'xml-js';
import { xmlToJson } from './Utils';

export {};
declare global {
    interface Array<T> {
      pushUniqueValue(elem: T): T[];
    }
}

if (!Array.prototype.pushUniqueValue) {
  Array.prototype.pushUniqueValue = function<T>(elem: T): T[] {
    if (!this.includes(elem)) {
      this.push(elem);
    }
    return this;
  };
}

if (Symbol['asyncIterator'] === undefined) {
  // tslint:disable-next-line:no-any
  ((Symbol as any)['asyncIterator']) = Symbol.for('asyncIterator');
}

class CollateConfigFile {

    public quickFilters: string[];
    public excludeManaged: boolean;
    public apiVersion: string;

    constructor(fileName: string) {
        if (fileName !== undefined) {
            jf.readFile(fileName, (err, obj) => {
                if (err) {
                  throw err;
                } else {
                  this.apiVersion = obj.apiVersion;
                  this.quickFilters = obj.quickFilter.split(',') || [];
                  this.excludeManaged = (obj.excludeManaged === 'true') || false;
                }
            });
        }
    }

}

export class Packagexml {

    public configs: CollateConfigFile;
    public quickFilters: string[];
    public excludeManaged: boolean;
    public apiVersion: string;
    private conn: Connection;

    constructor(conn: Connection, configfile: string, quickfilter: string, excludemanaged: boolean, apiversion: string) {
        this.conn = conn;
        const configs = new CollateConfigFile(configfile);
        this.quickFilters = quickfilter ? quickfilter.split(',') || configs.quickFilters : [];
        this.excludeManaged = excludemanaged || configs.excludeManaged || false;
        this.apiVersion = apiversion;
    }

    public async build(fileType: string) {
        try {
            const packageTypes = {};
            const describe = await this.conn.metadata.describe(this.apiVersion);
            const folders = [];
            const unfolderedObjects = [];
            let ipPromise;

            for await (const object of describe.metadataObjects) {
              if (object.inFolder) {
                const objectType = object.xmlName.replace('Template', '');
                const promise = this.conn.metadata.list({
                  type: `${objectType}Folder`
                }, this.apiVersion);
                folders.push(promise);
              } else {
                const promise = this.conn.metadata.list({
                  type: object.xmlName
                }, this.apiVersion);
                if (object.xmlName === 'InstalledPackage') {
                  ipPromise = promise.then(); // clone promise
                }
                unfolderedObjects.push(promise);
              }
            }

            const folderedObjects = [];
            for await (const folder of folders) {
              let folderItems = [];
              if (Array.isArray(folder)) {
                folderItems = folder;
              } else if (folder) {
                folderItems = [folder];
              }
              if (folderItems.length > 0) {
                for await (const folderItem of folderItems) {
                  let objectType = folderItem.type.replace('Folder', '');
                  if (objectType === 'Email') {
                    objectType += 'Template';
                  }
                  const promise = this.conn.metadata.list({
                    type: objectType,
                    folder: folderItem.fullName
                  }, this.apiVersion);
                  folderedObjects.push(promise);
                }
              }
            }

            // fetch and execute installed package promise to build regex
            let ipRegexStr: string = '^(';
            let ipRegex: RegExp;
            ipPromise.then(instPack => {
              instPack.forEach(pkg => {
                ipRegexStr += pkg.namespacePrefix + '|';
              });
              ipRegexStr += ')+__';
              ipRegex = RegExp(ipRegexStr);
            });

            const flowDefinitionQuery = await this.conn.tooling.query('SELECT DeveloperName, ActiveVersion.VersionNumber FROM FlowDefinition');

            const activeFlowVersions = [];
            for await (const record of flowDefinitionQuery.records) {
              if (record['ActiveVersion']) {
                if (!activeFlowVersions[record['DeveloperName']]) {
                  activeFlowVersions[record['DeveloperName']] = [];
                }
                activeFlowVersions[record['DeveloperName']].pushUniqueValue(record['ActiveVersion']['VersionNumber']);
              }
            }

            (await Promise.all(unfolderedObjects)).forEach(unfolderedObject => {
              try {
                if (unfolderedObject) {
                  let unfolderedObjectItems = [];
                  if (Array.isArray(unfolderedObject)) {
                    unfolderedObjectItems = unfolderedObject;
                  } else {
                    unfolderedObjectItems = [unfolderedObject];
                  }
                  unfolderedObjectItems.forEach(metadataEntries => {
                    /**
                     * Managed package - fullName starts with 'namespacePrefix__' || namespacePrefix is not null || manageableState = installed
                     * Unmanaged package - manageableState = unmanaged
                     * Regular custom objects - manageableState = unmanaged or undefined
                     */
                    if (metadataEntries) {
                      if ( metadataEntries.type && !(this.excludeManaged && (ipRegex.test(metadataEntries.fullName) || metadataEntries.namespacePrefix || metadataEntries.manageableState === 'installed'))) {
                        if (metadataEntries.fileName.includes('ValueSetTranslation')) {
                          const x = metadataEntries.fileName.split('.')[1].substring(0, 1).toUpperCase() + metadataEntries.fileName.split('.')[1].substring(1);
                          if (!packageTypes[x]) {
                            packageTypes[x] = [];
                          }
                          packageTypes[x].pushUniqueValue(metadataEntries.fullName);
                        } else {

                          if (!packageTypes[metadataEntries.type]) {
                            packageTypes[metadataEntries.type] = [];
                          }

                          if (metadataEntries.type === 'Flow') {

                            if (activeFlowVersions[metadataEntries.fullName]) {
                              packageTypes[metadataEntries.type].pushUniqueValue(`${metadataEntries.fullName}-${activeFlowVersions[metadataEntries.fullName]}`);
                            } else {
                              packageTypes[metadataEntries.type].pushUniqueValue(metadataEntries.fullName);
                            }

                          } else {
                            packageTypes[metadataEntries.type].pushUniqueValue(metadataEntries.fullName);
                          }

                        }
                      }
                    } else {
                    //   this.ux.error('No metadataEntry available');
                    }
                  });
                }
              } catch (err) {
                // this.ux.error(err);
              }
            });

            (await Promise.all(folderedObjects)).forEach(folderedObject => {
              try {

                if (folderedObject) {
                  let folderedObjectItems = [];
                  if (Array.isArray(folderedObject)) {
                    folderedObjectItems = folderedObject;
                  } else {
                    folderedObjectItems = [folderedObject];
                  }
                  folderedObjectItems.forEach(metadataEntries => {
                    if (metadataEntries) {
                        if ((metadataEntries.type && metadataEntries.manageableState !== 'installed') || (metadataEntries.type && metadataEntries.manageableState === 'installed' && !this.excludeManaged)) {
                            if (!packageTypes[metadataEntries.type]) {
                                packageTypes[metadataEntries.type] = [];
                            }
                            packageTypes[metadataEntries.type].pushUniqueValue(metadataEntries.fullName);
                        }
                    } else {
                    //   this.ux.error('No metadataEntry available');
                    }
                  });
                }
              } catch (err) {
                // this.ux.error(err);
              }
            });

            if (!packageTypes['StandardValueSet']) {
              packageTypes['StandardValueSet'] = [];
            }
            ['AccountContactMultiRoles', 'AccountContactRole', 'AccountOwnership', 'AccountRating', 'AccountType', 'AddressCountryCode', 'AddressStateCode', 'AssetStatus', 'CampaignMemberStatus', 'CampaignStatus', 'CampaignType', 'CaseContactRole', 'CaseOrigin', 'CasePriority', 'CaseReason', 'CaseStatus', 'CaseType', 'ContactRole', 'ContractContactRole', 'ContractStatus', 'EntitlementType', 'EventSubject', 'EventType', 'FiscalYearPeriodName', 'FiscalYearPeriodPrefix', 'FiscalYearQuarterName', 'FiscalYearQuarterPrefix', 'IdeaCategory', 'IdeaMultiCategory', 'IdeaStatus', 'IdeaThemeStatus', 'Industry', 'InvoiceStatus', 'LeadSource', 'LeadStatus', 'OpportunityCompetitor', 'OpportunityStage', 'OpportunityType', 'OrderStatus', 'OrderType', 'PartnerRole', 'Product2Family', 'QuestionOrigin', 'QuickTextCategory', 'QuickTextChannel', 'QuoteStatus', 'SalesTeamRole', 'Salutation', 'ServiceContractApprovalStatus', 'SocialPostClassification', 'SocialPostEngagementLevel', 'SocialPostReviewedStatus', 'SolutionStatus', 'TaskPriority', 'TaskStatus', 'TaskSubject', 'TaskType', 'WorkOrderLineItemStatus', 'WorkOrderPriority', 'WorkOrderStatus'].forEach(member => {
              packageTypes['StandardValueSet'].pushUniqueValue(member);
            });

            const packageJson = {
              _declaration: {_attributes: {version: '1.0', encoding: 'utf-8'}},
              Package: [{
                _attributes: {xmlns: 'http://soap.sforce.com/2006/04/metadata'},
                types: [],
                version: this.apiVersion
              }]
            };

            Object.keys(packageTypes).forEach(mdtype => {
              if ((this.quickFilters.length === 0 || this.quickFilters.includes(mdtype))) {
                packageJson.Package[0].types.push({
                  name: mdtype,
                  members: packageTypes[mdtype]
                });
              }
            });
            const packageXml = convert.js2xml(packageJson, { compact: true, spaces: 4 });
            const packageJSON = xmlToJson(packageXml);
            return fileType === 'xml' ? packageXml : packageJSON;
          } catch (err) {
            // this.ux.error(err);
          }
    }
}
