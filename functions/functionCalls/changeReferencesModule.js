
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");


const logger = require("firebase-functions/logger");


exports.handleProposalReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    logger.log(afterData.data().metadata.fromFunction);
    if (afterData.data().metadata.fromFunction) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data().tenant.id !== afterData.data().tenant.id && changed.push(['tenant', beforeData.data().tenant.id, afterData.data().tenant.id]);
    beforeData.data().management.id !== afterData.data().management.id && changed.push(['management', beforeData.data().management.id, afterData.data().management.id]);
    beforeData.data().property.id !== afterData.data().property.id && changed.push(['property', beforeData.data().property.id, afterData.data().property.id]);
    beforeData.data().property.entity.id !== afterData.data().property.entity.id && changed.push(['entity', beforeData.data().property.entity.id, afterData.data().property.entity.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().proposals.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                proposals: filteredReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().proposals||[]
            if (afterDataList.every(ref => ref.id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref]);
                transaction.update(group[1].ref, { // update
                    proposals: addedReferenceList,
                    'metadata.fromFunction': true,
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
    if (afterData.data().metadata.fromFunction) return;
    // get database
    const db = getFirestore()
    // get difference data
    let changed = [];
    beforeData.data().entity.id !== afterData.data().entity.id && changed.push(['entity', beforeData.data().entity.id, afterData.data().entity.id]);
    // get the afterData id document
    // and then do a get on it
    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().propertys.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                propertys: filteredReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().propertys||[]
            if (afterDataList.every(ref => ref.id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref]);
                transaction.update(group[1].ref, { // update
                    propertys: addedReferenceList,
                    'metadata.fromFunction': true,
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
    if (afterData.data().metadata.fromFunction) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data().property.id !== afterData.data().property.id && changed.push(['property', beforeData.data().property.id, afterData.data().property.id]);
    beforeData.data().property.entity.id !== afterData.data().property.entity.id && changed.push(['entity', beforeData.data().property.entity.id, afterData.data().property.entity.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => Promise.all([db.collection(v[0]).doc(v[1]).get(), db.collection(v[0]).doc(v[2]).get()]));
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((group) => {
            // filter out old reference
            const filteredReferenceList = group[0].data().buildings.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(group[0].ref, { // update
                buildings: filteredReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
            // check if new one has reference added
            const afterDataList = group[1].data().buildings||[]
            if (afterDataList.every(ref => ref.id !== afterData.ref.id)) {
                const addedReferenceList = afterDataList.concat([afterData.ref]);
                transaction.update(group[1].ref, { // update
                    buildings: addedReferenceList,
                    'metadata.fromFunction': true,
                    lastEdited: FieldValue.serverTimestamp(),
                });
            }
        });
    });

    return { success:true };
}





