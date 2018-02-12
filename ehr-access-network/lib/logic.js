'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.acme.biznet.Access} access
 * @transaction
 */
// function onChangeAssetValue(changeAssetValue) {
//     var assetRegistry;
//     var id = changeAssetValue.relatedAsset.assetId;
//     return getAssetRegistry('org.acme.biznet.SampleAsset')
//         .then(function(ar) {
//             assetRegistry = ar;
//             return assetRegistry.get(id);
//         })
//         .then(function(asset) {
//             asset.value = changeAssetValue.newValue;
//             return assetRegistry.update(asset);
//         });
// }

/**
 * Grant or deny access to a specific file by a requesting entity
 * @param {org.acme.biznet.AccessRequest} access request - the access request to be tested, then granted or denied
 * @transaction
 */

/** A transaction processor function description
* @param {org.acme.biznet.AccessRequest} accessRequest-the access request to be tested, then granted or denied
* @transaction
*/

function handleAccessRequest(accessRequest) {
 
    var roleOrgIDs = accessRequest.requestingProvider.roleOrgs;
  	var len=accessRequest.fileAccess.accessList.length;
  	var lenRoles = accessRequest.requestingProvider.roleOrgs.length;
  	var success = 0;
    
	var i = 0;
    while (i < len && success == 0) {
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
  
    accessGrant.fileAccess.accessList.push(accessGrant.accessEntity);
    
    return getAssetRegistry('org.acme.biznet.Access')
        .then(function (assetRegistry) {
      return assetRegistry.update(accessGrant.fileAccess);
    });
}

/** A transaction processor function description
* @param {org.acme.biznet.AddRoleOrg} addingRoleOrg-the role org transaction to be added to a provider
* @transaction
*/

function handleAddingRoleOrg(addingRoleOrg) {
  
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
* @param {org.acme.biznet.RevokeRoleOrg} revokingRoleOrg-the role org transaction to be revoked from a provider
* @transaction
*/

function handleAddingRoleOrg(revokingRoleOrg) {
  
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