import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.biznet{
   export class Access extends Asset {
      fileID: string;
      accessList: RoleOrgProvider[];
      accesses: AccessEvent[];
      blockedAccess: RoleOrgProvider[];
      fileOwner: Patient;
   }
   export abstract class RoleOrgProvider {
      organization: string;
      role: string;
      providers: Provider[];
   }
   export abstract class AccessEvent {
      requestingProvider: Provider;
      fileID: string;
      timeRequested: Date;
   }
   export class Patient extends Participant {
      patientID: string;
      firstName: string;
      lastName: string;
   }
   export class Provider extends Participant {
      providerID: string;
      firstName: string;
      lastName: string;
      organization: string;
      roles: string[];
   }
   export class AccessRequest extends Transaction {
      fileAccess: Access;
      accessevent: AccessEvent;
      fileID: string;
   }
   export class AccessBlock extends Transaction {
      fileAccess: Access;
      blockedEntities: RoleOrgProvider;
      fileID: string;
   }
   export class AccessGrant extends Transaction {
      fileAccess: Access;
      accessEntities: RoleOrgProvider;
      fileID: string;
   }
// }
