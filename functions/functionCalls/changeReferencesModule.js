
/*
    Purpose is to handle when reference changes. for example, when object A references object B and then object A is changed to reference object C,
    I want to remove the reference connecting reference A to reference B and also check if reference C has reference A.

    This is for everything that can reference other collections. If a referenced collection is changed, make sure that the db is up to date.
*/


const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");


const logger = require("firebase-functions/logger");


exports.handleProposalReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    logger.log(afterData.data().metadata.fromFunction);
    logger.log(afterData.data().metadata.toChangeReference);
    if (afterData.data().metadata.fromFunction 
        && !afterData.data().metadata.toChangeReference
        ) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data()?.property?.id !== afterData.data()?.property?.id && changed.push(['property', beforeData.data().property.id, afterData.data().property.id]);
    beforeData.data()?.property?.entity?.id !== afterData.data()?.property?.entity?.id && changed.push(['entity', beforeData.data().property.entity.id, afterData.data().property.entity.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().proposals.filter(id => id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                proposals: filteredReferenceList,
                'metadata.fromFunction': true,
                'metadata.toChangeReference': false,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().proposals||[]
            if (afterDataList.every(id => id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref.id]);
                transaction.update(group[1].ref, { // update
                    proposals: addedReferenceList,
                    'metadata.fromFunction': true,
                    'metadata.toChangeReference': false,
                    lastEdited: FieldValue.serverTimestamp(),
                });
            }
        });
    });

    return { success:true };
}

exports.handlePropertyReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    logger.log(afterData.data().metadata.fromFunction);
    logger.log(afterData.data().metadata.toChangeReference);
    if (afterData.data().metadata.fromFunction 
        && !afterData.data().metadata.toChangeReference
        ) return;
    // get database
    const db = getFirestore()
    // get difference data
    let changed = [];
    beforeData.data()?.entity?.id !== afterData.data()?.entity?.id && changed.push(['entity', beforeData.data().entity.id, afterData.data().entity.id]);
    // get the afterData id document
    // and then do a get on it
    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().propertys.filter(id => id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                propertys: filteredReferenceList,
                'metadata.fromFunction': true,
                'metadata.toChangeReference': false,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().propertys||[]
            if (afterDataList.every(id => id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref.id]);
                transaction.update(group[1].ref, { // update
                    propertys: addedReferenceList,
                    'metadata.fromFunction': true,
                    'metadata.toChangeReference': false,
                    lastEdited: FieldValue.serverTimestamp(),
                });
            }
        });
    });

    return { success:true };
}

exports.handleBuildingReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    logger.log(afterData.data().metadata.fromFunction);
    logger.log(afterData.data().metadata.toChangeReference);
    if (afterData.data().metadata.fromFunction 
        && !afterData.data().metadata.toChangeReference
        ) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data()?.property?.id !== afterData.data()?.property?.id && changed.push(['property', beforeData.data().property.id, afterData.data().property.id]);
    beforeData.data()?.property?.entity?.id !== afterData.data()?.property?.entity?.id && changed.push(['entity', beforeData.data().property.entity.id, afterData.data().property.entity.id]);
    beforeData.data()?.management?.id !== afterData.data()?.management?.id && changed.push(['management', beforeData.data().management.id, afterData.data().management.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().buildings.filter(id => id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                buildings: filteredReferenceList,
                'metadata.fromFunction': true,
                'metadata.toChangeReference': false,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().buildings||[]
            if (afterDataList.every(id => id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref.id]);
                transaction.update(group[1].ref, { // update
                    buildings: addedReferenceList,
                    'metadata.fromFunction': true,
                    'metadata.toChangeReference': false,
                    lastEdited: FieldValue.serverTimestamp(),
                });
            }
        });
    });

    return { success:true };
}


exports.handleAddressReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    logger.log(afterData.data().metadata.fromFunction);
    logger.log(afterData.data().metadata.toChangeReference);
    if (afterData.data().metadata.fromFunction 
        && !afterData.data().metadata.toChangeReference
        ) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data()?.building?.id !== afterData.data()?.building?.id && changed.push(['building', beforeData.data().building.id, afterData.data().building.id]);
    beforeData.data()?.building?.property?.id !== afterData.data()?.building?.property?.id && changed.push(['property', beforeData.data().building.property.id, afterData.data().building.property.id]);
    beforeData.data()?.building?.property?.entity?.id !== afterData.data()?.building?.property?.entity?.id && changed.push(['entity', beforeData.data().building.property.entity.id, afterData.data().building.property.entity.id]);
    beforeData.data()?.tenant?.id !== afterData.data()?.tenant?.id && changed.push(['tenant', beforeData.data().tenant.id, afterData.data().tenant.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().addresss.filter(id => id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                addresss: filteredReferenceList,
                'metadata.fromFunction': true,
                'metadata.toChangeReference': false,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().addresss||[]
            if (afterDataList.every(id => id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref.id]);
                transaction.update(group[1].ref, { // update
                    addresss: addedReferenceList,
                    'metadata.fromFunction': true,
                    'metadata.toChangeReference': false,
                    lastEdited: FieldValue.serverTimestamp(),
                });
            }
        });
    });

    return { success:true };
}





