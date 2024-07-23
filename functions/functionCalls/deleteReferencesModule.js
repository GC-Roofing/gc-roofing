
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");


//////////////////// YOU SHOULD RUN THE READ AND WRITES AS A TRANSACTION SO THAT ATOMICITY IS KEPT
//////////////////// edit the last edited too.

exports.handleProposalReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const tenant = db.collection('tenant');
        const management = db.collection('management');
        const property = db.collection('property');
        const entity = db.collection('entity');
        // querysnapshot
        let tenantSnapshot = tenant.where('proposals', 'array-contains', dataRef).get();
        let managementSnapshot = management.where('proposals', 'array-contains', dataRef).get();
        let propertySnapshot = property.where('proposals', 'array-contains', dataRef).get();
        let entitySnapshot = entity.where('proposals', 'array-contains', dataRef).get();

        [tenantSnapshot, managementSnapshot, propertySnapshot, entitySnapshot] = await Promise.all([tenantSnapshot, managementSnapshot, propertySnapshot, entitySnapshot]);
        // get new reference list
        tenantSnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                proposals: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        managementSnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                proposals: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        propertySnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                proposals: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        entitySnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                proposals: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handlePropertyReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const entity = db.collection('entity');
        // querysnapshot
        const querySnapshot = await entity.where('propertys', 'array-contains', dataRef).get();

        // get new reference list
        querySnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().propertys.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                propertys: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}

exports.handleBuildingReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()

    db.runTransaction(async transaction => {
        // get assessment collection
        const property = db.collection('property');
        const entity = db.collection('entity');
        // querysnapshot
        let propertySnapshot = property.where('buildings', 'array-contains', dataRef).get();
        let entitySnapshot = entity.where('buildings', 'array-contains', dataRef).get();

        [propertySnapshot, entitySnapshot] = await Promise.all([propertySnapshot, entitySnapshot]);
        // get new reference list
        entitySnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                buildings: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });

        propertySnapshot.forEach((doc) => {
            const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
            transaction.update(doc.ref, {
                buildings: updatedReferenceList,
                'metadata.fromFunction': true,
                lastEdited: FieldValue.serverTimestamp(),
            });
        });
    });

    return { success:true };
}





