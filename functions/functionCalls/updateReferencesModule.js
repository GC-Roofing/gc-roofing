

const {getFirestore} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");
const FieldValue = require("firebase-admin").FieldValue;


exports.handleEntityReferences = async (event) => {
    // do a check here for if the lastEdited is before current lastEdited

    // get data
    const dataRef = event.data.after.ref;
    const data = event.data.after.data();
    // get database
    const db = getFirestore()
    // get assessment collection
    const property = db.collection('property');
    // querysnapshot
    let propertySnapshot = property.where('entity_id', 'in', data.propertys.map(v => v.id)).get();

    [propertySnapshot] = await Promise.all([propertySnapshot]);
    // edit reference list
    const batch = db.batch();

    // make sure to update lastEdited too.
    propertySnapshot.forEach((doc) => {

    })

    // tenantSnapshot.forEach((doc) => {
    //     const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
    //     batch.update(doc.ref, {proposals: updatedReferenceList});
    // });

    // managementSnapshot.forEach((doc) => {
    //     const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
    //     batch.update(doc.ref, {proposals: updatedReferenceList});
    // });

    // propertySnapshot.forEach((doc) => {
    //     const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
    //     batch.update(doc.ref, {proposals: updatedReferenceList});
    // });

    // await batch.commit();

    // return { success:true };
}