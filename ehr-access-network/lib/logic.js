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
function handleAccessRequest(AccessRequest) {
  
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
}