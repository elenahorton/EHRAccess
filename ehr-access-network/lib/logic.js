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
        var allowedRoleOrg = accessRequest.fileAccess.accessList[i].OrgRoleID;
        var requestingRoleOrg = accessRequest.requestingProvider.roleOrgs[j].OrgRoleID;
    	if (allowedRoleOrg == requestingRoleOrg) {
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
  
    accessGrant.fileAccess.accessList.push(accessGrant.accessEntities);
    
    return getAssetRegistry('org.acme.biznet.Access')
        .then(function (assetRegistry) {
      return assetRegistry.update(accessGrant.fileAccess);
    });
}
  
    // retrieve the associated 'Access' from the registry
 	// the AccessRequest.accessEvent.accessorID should be matched to a known provider ID
  	// check the 'Access' asset's list of blocked RoleOrgProviders; verify that accessorID != any blocked provider IDs AND that <Role, Org> pairs matching accessorID <Role,Org> is not blocked
  // check the 'Access asset's list of accessible RoleOrgProviders; verify that accessorID's <role, org> pair is on the list or that the explicit providerID is on the list
  // if both tests pass, grant access, update registry
  // otherwise, deny access, alert user and Access owner (patient)
  
    // return getAssetRegistry('org.acme.biznet.Access')
    //     .then(function (assetRegistry) {
    //         return assetRegistry.update(trade.commodity);
    //     });
