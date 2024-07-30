
/*
    purpose is to update all nested objects that are newly referenced. For example, if object A reference Object B and object B gets updated,
    I want that update to be reflected in object B. Forms.js only updates the main form it is working with. 

    Everything here is referenced to and can be edited not on its original form
*/

const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");
// const FieldValue = require("firebase-admin").FieldValue;

// const logger = require("firebase-functions/logger");


exports.handleEntityReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();

    // check if this update is from a cloud function
    if (data.metadata.fromFunction) return;

    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const address = db.collection('address');
        const property = db.collection('property');
        const building = db.collection('building');
        const proposal = db.collection('proposal');
        // querysnapshot
        let addressSnapshot = Promise.all((data.addresss||[]).map(v => address.doc(v).get()));
        let propertySnapshot = Promise.all((data.propertys||[]).map(v => property.doc(v).get()));
        let buildingSnapshot = Promise.all((data.buildings||[]).map(v => bulding.doc(v).get()));
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => proposal.doc(v).get()));


        [addressSnapshot, propertySnapshot, buildingSnapshot, proposalSnapshot] = await Promise.all([addressSnapshot, propertySnapshot, buildingSnapshot, proposalSnapshot]);

        // edit reference list
        addressSnapshot.forEach((doc) => {
            const updatedEntity = Object.keys(doc.data().building.property.entity).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                'building.property.entity': updatedEntity,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        propertySnapshot.forEach((doc) => {
            const updatedEntity = Object.keys(doc.data().entity).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                entity: updatedEntity,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        buildingSnapshot.forEach((doc) => {
            const updatedEntity = Object.keys(doc.data().property.entity).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                'property.entity': updatedEntity,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        proposalSnapshot.forEach((doc) => {
            const updatedEntity = Object.keys(doc.data().property.entity).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                'property.entity': updatedEntity,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handleManagementReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();

    // check if this update is from a cloud function
    if (data.metadata.fromFunction) return;

    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const address = db.collection('address');
        const building = db.collection('building');
        // querysnapshot
        let addressSnapshot = Promise.all((data.addresss||[]).map(v => address.doc(v).get()));
        let buildingSnapshot = Promise.all((data.buildings||[]).map(v => building.doc(v).get()));

        [addressSnapshot, buildingSnapshot] = await Promise.all([addressSnapshot, buildingSnapshot]);

        // edit reference list
        // make sure to update lastEdited too.
        addressSnapshot.forEach((doc) => {
            const updatedManagement = Object.keys(doc.data().building.management).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                'building.management': updatedManagement,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        buildingSnapshot.forEach((doc) => {
            const updatedManagement = Object.keys(doc.data().management).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                management: updatedManagement,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handleTenantReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();

    // check if this update is from a cloud function
    if (data.metadata.fromFunction) return;

    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const address = db.collection('address');
        // querysnapshot
        let addressSnapshot = Promise.all((data.addresss||[]).map(v => address.doc(v).get()));

        [addressSnapshot] = await Promise.all([addressSnapshot]);

        // edit reference list
        // make sure to update lastEdited too.
        addressSnapshot.forEach((doc) => {
            const updatedTenant = Object.keys(doc.data().tenant).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                tenant: updatedTenant,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handlePropertyReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();

    // check if this update is from a cloud function
    if (data.metadata.fromFunction) return;

    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const address = db.collection('address');
        const building = db.collection('building');
        const proposal = db.collection('proposal');
        // querysnapshot
        let addressSnapshot = Promise.all((data.addresss||[]).map(v => address.doc(v).get()));
        let buildingSnapshot = Promise.all((data.buildings||[]).map(v => building.doc(v).get()));
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => proposal.doc(v).get()));

        [addressSnapshot, buildingSnapshot, proposalSnapshot] = await Promise.all([addressSnapshot, buildingSnapshot, proposalSnapshot]);

        // edit reference list
        addressSnapshot.forEach((doc) => {
            const updatedProperty = Object.keys(doc.data().building.property).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                'building.property': updatedProperty,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        buildingSnapshot.forEach((doc) => {
            const updatedProperty = Object.keys(doc.data().property).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                property: updatedProperty,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        proposalSnapshot.forEach((doc) => {
            const updatedProperty = Object.keys(doc.data().property).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                property: updatedProperty,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handleBuildingReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();

    // check if this update is from a cloud function
    if (data.metadata.fromFunction) return;

    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const address = db.collection('address');
        // querysnapshot
        let addressSnapshot = Promise.all((data.addresss||[]).map(v => address.doc(v).get()));

        [addressSnapshot] = await Promise.all([addressSnapshot]);

        // edit reference list
        addressSnapshot.forEach((doc) => {
            const updatedBuilding = Object.keys(doc.data().building).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                building: updatedBuilding,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}





