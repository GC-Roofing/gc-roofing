
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");


const logger = require("firebase-functions/logger");

//////////////////// YOU SHOULD RUN THE READ AND WRITES AS A TRANSACTION SO THAT ATOMICITY IS KEPT
//////////////////// edit the last edited too.

exports.handleProposalReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    if (afterData.data().metadata.fromFunction) return;
    // get database
    const db = getFirestore();
    // get difference data
    let changed = [];
    beforeData.data().tenant.id !== afterData.data().tenant.id && changed.push(['tenant', beforeData.data().tenant.id]);
    beforeData.data().management.id !== afterData.data().management.id && changed.push(['management', beforeData.data().management.id]);
    beforeData.data().property.id !== afterData.data().property.id && changed.push(['property', beforeData.data().property.id]);
    beforeData.data().property.entity.id !== afterData.data().property.entity.id && changed.push(['entity', beforeData.data().property.entity.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => db.collection(v[0]).doc(v[1]).get());
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((doc) => {
            const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(doc.ref, {
                proposals: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            })
        });
    });

    return { success:true };
}

exports.handlePropertyReferences = async (event) => {
    // get data
    const beforeData = event.data.before;
    const afterData = event.data.after;
    // check if this update is from a cloud function
    if (afterData.data().metadata.fromFunction) return;
    // get database
    const db = getFirestore()
    // get difference data
    let changed = [];
    logger.log(beforeData.data().entity.id)
    logger.log(afterData.data().entity.id)
    beforeData.data().entity.id !== afterData.data().entity.id && changed.push(['entity', beforeData.data().entity.id]);
    // get the afterData id document
    // and then do a get on it
    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => db.collection(v[0]).doc(v[1]).get());
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((doc) => {
            const updatedReferenceList = doc.data().propertys.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(doc.ref, {
                propertys: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            })
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
    beforeData.data().property.id !== afterData.data().property.id && changed.push(['property', beforeData.data().property.id]);
    beforeData.data().property.entity.id !== afterData.data().property.entity.id && changed.push(['entity', beforeData.data().property.entity.id]);

    db.runTransaction(async transaction => {
        // get assessment collection
        changed = changed.map(v => db.collection(v[0]).doc(v[1]).get());
        changed = await Promise.all(changed);
        // get new reference list
        changed.forEach((doc) => {
            const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== afterData.ref.id);
            transaction.update(doc.ref, {
                buildings: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            })
        });
    });

    return { success:true };
}





