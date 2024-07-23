
const {getFirestore} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");
const FieldValue = require("firebase-admin").FieldValue;


//////////////////// YOU SHOULD RUN THE READ AND WRITES AS A TRANSACTION SO THAT ATOMICITY IS KEPT
//////////////////// edit the last edited too.

exports.handleProposalReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()
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
    const batch = db.batch();

    tenantSnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {proposals: updatedReferenceList});
    });

    managementSnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {proposals: updatedReferenceList});
    });

    propertySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {proposals: updatedReferenceList});
    });

    entitySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {proposals: updatedReferenceList});
    });

    await batch.commit();

    return { success:true };
}

exports.handlePropertyReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()
    // get assessment collection
    const entity = db.collection('entity');
    // querysnapshot
    const querySnapshot = await entity.where('propertys', 'array-contains', dataRef).get();

    // get new reference list
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().propertys.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {propertys: updatedReferenceList});
    });

    await batch.commit();

    return { success:true };
}

exports.handleBuildingReferences = async (event) => {
    // get data
    const dataRef = event.data.ref;
    // get database
    const db = getFirestore()
    // get assessment collection
    const property = db.collection('property');
    const entity = db.collection('entity');
    // querysnapshot
    let propertySnapshot = property.where('buildings', 'array-contains', dataRef).get();
    let entitySnapshot = entity.where('buildings', 'array-contains', dataRef).get();

    [propertySnapshot, entitySnapshot] = await Promise.all([propertySnapshot, entitySnapshot]);
    // get new reference list
    const batch = db.batch();

    entitySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {buildings: updatedReferenceList});
    });

    propertySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {buildings: updatedReferenceList});
    });

    await batch.commit();

    return { success:true };
}





