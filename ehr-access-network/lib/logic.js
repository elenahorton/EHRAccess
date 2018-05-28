'use strict';
/**
 * Transaction processor functions
 */

/** A transaction processor function description
* @param {org.acme.biznet.AccessRequest} accessRequest-the access request to be tested, then granted or denied
* @transaction
*/

function handleAccessRequest(accessRequest) {

    var me = getCurrentParticipant();
    console.log('@debug: **** REQUESTING ACCESS: ' + me.getIdentifier() + ' requesting access of ' + accessRequest.fileAccess);

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }
    if (me.getIdentifier() != accessRequest.requestingProvider.entityID) {
        throw new Error('Requesting provider is not the current participant, request denied.')
    }
 
  	var len=accessRequest.fileAccess.accessList.length;
    var roleOrgIDs = accessRequest.requestingProvider.roleOrgs;
  	var lenRoles = accessRequest.requestingProvider.roleOrgs.length;
    var success = 0;
    var blocked = 0;
      
    // first ensure that the requesting entity is not blocked
    for (var b = 0; b < accessRequest.fileAccess.blockedList.length; b++) {
        if (accessRequest.requestingProvider.entityID == accessRequest.fileAccess.blockedList[b].entityID) {
            blocked = 1; 
            break;
        }
    }
    
	var i = 0;
    while (i < len && success == 0 && blocked == 0) {
      for(var j=0; j< lenRoles; j++) {
        var allowedEntity = accessRequest.fileAccess.accessList[i].entityID;
        var requestingRoleOrg = accessRequest.requestingProvider.roleOrgs[j].entityID;
    	if (allowedEntity == requestingRoleOrg || allowedEntity == accessRequest.requestingProvider.entityID) {
          accessRequest.fileAccess.accessCount++;
          success = 1;
          break;
      	}
      i++;
      }
    }
    
    return getAssetRegistry('org.acme.biznet.Access')
        .then(function (assetRegistry) {
      
       var accessNotification = getFactory().newEvent('org.acme.biznet', 'AccessEvent');
        accessNotification.fileAccessed = accessRequest.fileAccess;
        accessNotification.requestingProvider = accessRequest.requestingProvider;
      	accessNotification.success = success;
        emit(accessNotification);
      return assetRegistry.update(accessRequest.fileAccess);
    });
}

/** A transaction processor function description
* @param {org.acme.biznet.AccessGrant} accessGrant-the access to be granted
* @transaction
*/

function handleAccessGrant(accessGrant) {

    var fileOwner = accessGrant.fileAccess.fileOwner;
    var currentParticipant = getCurrentParticipant();
    if (currentParticipant.getFullyQualifiedIdentifier() !== fileOwner.getFullyQualifiedIdentifier()) {
        throw new Error('Access can only be granted to this file by the owner of this file');
        return;
    }
  
    accessGrant.fileAccess.accessList.push(accessGrant.accessEntity);
    
    return getAssetRegistry('org.acme.biznet.Access')
        .then(function (assetRegistry) {
      return assetRegistry.update(accessGrant.fileAccess);
    });
}

/** A transaction processor function description
* @param {org.acme.biznet.AccessBlock} accessBlock- the access asset to be blocked
* @transaction
*/

function handleAccessBlock(accessBlock) {
  
    var fileOwner = accessBlock.fileAccess.fileOwner;
    var currentParticipant = getCurrentParticipant();
    if (currentParticipant.getFullyQualifiedIdentifier() !== fileOwner.getFullyQualifiedIdentifier()) {
        throw new Error('Access can only be blocked to this file by the owner of this file');
        return;
    }
    accessBlock.fileAccess.blockedList.push(accessBlock.blockedEntity);
    
    return getAssetRegistry('org.acme.biznet.Access')
        .then(function (assetRegistry) {
      return assetRegistry.update(accessBlock.fileAccess);
    });
}

/** A transaction processor function description
 * Only provider admins can add or revoke roles to and from providers
* @param {org.acme.biznet.AddRoleOrg} addingRoleOrg-the role org transaction to be added to a provider
* @transaction
*/

function handleAddingRoleOrg(addingRoleOrg) {

    var me = getCurrentParticipant();
    console.log('@debug: **** ADDING ROLEORG: ' + me.getIdentifier() + ' adding access of ' + addingRoleOrg.provider + ' to ' + addingRoleOrg.roleOrg);

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }
    if (me.getFullyQualifiedType() != "org.acme.biznet.ProviderAdmin") {
        console.log('@debug: requesting provider: ' + me.getIdentifier() + ' is not a provider admin, denying transaction');
        throw new Error('Current participant is not an admin, cannot add or revoke roles to/from providers.');
        return
    }
  
    addingRoleOrg.provider.roleOrgs.push(addingRoleOrg.roleOrg);
    addingRoleOrg.roleOrg.providers.push(addingRoleOrg.provider);
    
    var updateList1 = getParticipantRegistry('org.acme.biznet.Provider')
        .then(function (participantRegistry) {
      return participantRegistry.update(addingRoleOrg.provider);
    });

    var updateList2 = getParticipantRegistry('org.acme.biznet.RoleOrg')
        .then(function (participantRegistry) {
        return participantRegistry.update(addingRoleOrg.roleOrg);
    });

    return updateList1 && updateList2;
}

/** A transaction processor function description
 * Only provider admins can add or revoke roles to and from providers
* @param {org.acme.biznet.RevokeRoleOrg} revokingRoleOrg-the role org transaction to be revoked from a provider
* @transaction
*/

function handleRevokingRoleOrg(revokingRoleOrg) {
  
    var me = getCurrentParticipant();
    console.log('@debug: **** REVOKING ROLEORG: ' + me.getIdentifier() + ' revoking access of ' + revokingRoleOrg.provider + ' from ' + revokingRoleOrg.roleOrg);

    if(!me) {
        throw new Error('A participant/certificate mapping does not exist.');
    }
    if (me.getFullyQualifiedType() != "org.acme.biznet.ProviderAdmin") {
        console.log('@debug: requesting provider: ' + me.getIdentifier() + ' is not a provider admin, denying transaction');
        throw new Error('Current participant is not an admin, cannot add or revoke roles to/from providers.');
        return
    }

    var index = revokingRoleOrg.provider.roleOrgs.indexOf(revokingRoleOrg.roleOrg);
    if (index !== -1) {
        revokingRoleOrg.provider.roleOrgs.splice(index, 1);
    }

    var provIndex = revokingRoleOrg.roleOrg.providers.indexOf(revokingRoleOrg.provider);
    if (provIndex !== -1) {
        revokingRoleOrg.roleOrg.providers.splice(provIndex, 1);
    }
    
    var updateList1 = getParticipantRegistry('org.acme.biznet.Provider')
        .then(function (participantRegistry) {
      return participantRegistry.update(revokingRoleOrg.provider);
    });

    var updateList2 = getParticipantRegistry('org.acme.biznet.RoleOrg')
        .then(function (participantRegistry) {
        return participantRegistry.update(revokingRoleOrg.roleOrg);
    });

    return updateList1 && updateList2;
}