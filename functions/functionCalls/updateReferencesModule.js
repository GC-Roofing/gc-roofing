

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
        const property = db.collection('property');
        const building = db.collection('building');
        const proposal = db.collection('proposal');
        // querysnapshot
        let propertySnapshot = Promise.all((data.propertys||[]).map(v => v.get()));
        let buildingSnapshot = Promise.all((data.buildings||[]).map(v => v.get()));
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => v.get()));


        [propertySnapshot, buildingSnapshot, proposalSnapshot] = await Promise.all([propertySnapshot, buildingSnapshot, proposalSnapshot]);

        // edit reference list
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
        const proposal = db.collection('proposal');
        // querysnapshot
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => v.get()));

        [proposalSnapshot] = await Promise.all([proposalSnapshot]);

        // edit reference list
        // make sure to update lastEdited too.
        proposalSnapshot.forEach((doc) => {
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
        const proposal = db.collection('proposal');
        // querysnapshot
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => v.get()));

        [proposalSnapshot] = await Promise.all([proposalSnapshot]);

        // edit reference list
        // make sure to update lastEdited too.
        proposalSnapshot.forEach((doc) => {
            const updatedTenant = Object.keys(doc.data().tenant).reduce((acc, v) => {
                acc[v] = data[v];
                return acc;
            }, {});
            transaction.update(doc.ref, {
                management: updatedTenant,
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
        const building = db.collection('building');
        const proposal = db.collection('proposal');
        // querysnapshot
        let buildingSnapshot = Promise.all((data.buildings||[]).map(v => v.get()));
        let proposalSnapshot = Promise.all((data.proposals||[]).map(v => v.get()));

        [buildingSnapshot, proposalSnapshot] = await Promise.all([buildingSnapshot, proposalSnapshot]);

        // edit reference list
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





