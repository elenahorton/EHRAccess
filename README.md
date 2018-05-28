# EHRAccess
### Elena Horton, April 2018

### This repository contains code for an EHR access control blockchain network, run with Hyperledger Composer, and a skeleton node.js application.

The most recent version of this network is packaged in the *business network archive* file (`.bna`) is `ehr-access-network@0.0.3.bna`

To run the network, you must install all the prequesites of Composer, found here: `https://hyperledger.github.io/composer/latest/installing/installing-prereqs`

You must then run the `startFabric.sh` and `createPeerAdmin.sh` scripts. 

Then run `composer network deploy -a ehr-access-network@0.0.3.bna  -A admin -S adminpw -c PeerAdmin@hlfv1 -f networkadmin.card` and 

`composer card import --file networkadmin.card `

Additional documentation for troubleshooting found here: `https://hyperledger.github.io/composer/latest/introduction/introduction.html`

Hyperledger scripts are found in the `Hyperledger` folder, transaction and participant models are found in the `model` folder, and chaincode logic is found in `logic.js` in the `lib` folder.

