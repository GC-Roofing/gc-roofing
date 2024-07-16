




// const {getFirestore} = require("firebase-admin/firestore");
// const { HttpsError} = require("firebase-functions/v2/https");


// exports.handleEntityReferences = async (event) => {
//     // get data
//     const dataRef = event.data.ref;
//     const data = event.data.data();
//     // get database
//     const db = getFirestore()
//     // get assessment collection
//     const tenant = db.collection('tenant');
//     const management = db.collection('management');
//     const property = db.collection('property');
//     // querysnapshot
//     let tenantSnapshot = tenant.where('proposals', 'array-contains', dataRef).get();
//     let managementSnapshot = management.where('proposals', 'array-contains', dataRef).get();
//     let propertySnapshot = property.where('proposals', 'array-contains', dataRef).get();

//     [tenantSnapshot, managementSnapshot, propertySnapshot] = await Promise.all([tenantSnapshot, managementSnapshot, propertySnapshot]);
//     // get new reference list
//     const batch = db.batch();

//     tenantSnapshot.forEach((doc) => {
//         const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
//         batch.update(doc.ref, {proposals: updatedReferenceList});
//     });

//     managementSnapshot.forEach((doc) => {
//         const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
//         batch.update(doc.ref, {proposals: updatedReferenceList});
//     });

//     propertySnapshot.forEach((doc) => {
//         const updatedReferenceList = doc.data().proposals.filter(ref => ref.id !== dataRef.id);
//         batch.update(doc.ref, {proposals: updatedReferenceList});
//     });

//     await batch.commit();

//     return { success:true };
// }