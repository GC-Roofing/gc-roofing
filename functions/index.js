/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onDocumentWritten, onDocumentDeleted} = require("firebase-functions/v2/firestore");

// const logger = require("firebase-functions/logger");

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");


initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.deleteProposalReferences = onDocumentWritten("/proposal/{docId}", async (event) => {
    if (!event.data.after.exists) {
        // get data
        const dataRef = event.data.ref;
        const data = event.data.data();
        // get database
        const db = getFirestore()
        // get assessment collection
        const tenant = db.collection('tenant');
        const management = db.collection('management');
        const property = db.collection('property');
        // querysnapshot
        let tenantSnapshot = tenant.where('proposals', 'array-contains', dataRef).get();
        let managementSnapshot = management.where('proposals', 'array-contains', dataRef).get();
        let propertySnapshot = property.where('proposals', 'array-contains', dataRef).get();

        [tenantSnapshot, managementSnapshot, propertySnapshot] = await Promise.all([tenantSnapshot, managementSnapshot, propertySnapshot]);
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

        await batch.commit();

        return { success:true };
    }
});

exports.deletePropertyReferences = onDocumentDeleted("/property/{docId}", async (event) => {
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
});

exports.deleteBuildingReferences = onDocumentDeleted("/building/{docId}", async (event) => {
    // get data
    const dataRef = event.data.ref;
    const data = event.data.data();
    // get database
    const db = getFirestore()
    // get assessment collection
    const transaction = db.collection('transaction');
    const property = db.collection('property');
    // querysnapshot
    let transactionSnapshot = transaction.where('buildings', 'array-contains', dataRef).get();
    let propertySnapshot = property.where('buildings', 'array-contains', dataRef).get();

    [transactionSnapshot, propertySnapshot] = await Promise.all([transactionSnapshot, propertySnapshot]);
    // get new reference list
    const batch = db.batch();

    transactionSnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {buildings: updatedReferenceList});
    });

    propertySnapshot.forEach((doc) => {
        const updatedReferenceList = doc.data().buildings.filter(ref => ref.id !== dataRef.id);
        batch.update(doc.ref, {buildings: updatedReferenceList});
    });

    await batch.commit();

    return { success:true };
});

exports.getData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, async (req) => {
    // console.log('/////////////////////////////')
    // init
    const firestore = getFirestore();
    const query = req.data;

    // params
    const collectionNames = query.collections;
    const select = query.select;
    const orderBy = query.orderBy || select[0];
    const orderDirection = query.orderDirection || 'asc';
    const filter = query.filter;
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 25;
    const groupBy = query.groupBy || [];
    const groupByOrder = query.groupByOrder || [];
    const dataFunc = eval(query.dataFunc) || ((v) => v);

    // check if the collection param is correct
    if (!collectionNames) {
        throw new HttpsError('invalid-argument', "Collection is required.");
    } else if (!Array.isArray(collectionNames)) {
        throw new HttpsError('invalid-argument', "Select should be a list of collections")
    } else if (!select) {
        throw new HttpsError('invalid-argument', "Select field names required.")
    }


    try {
        // get collections
        // console.log('derek ------> getting collections');
        let returnCollections = await Promise.all(collectionNames.map(async c => {
            let collectionRef = firestore.collection(c);
            let query = collectionRef.select(...select);
            let querySnapshot = await query.get();
            return querySnapshot.docs.map(doc => ({id:doc.id, data: {...doc.data()}}));
        }));


        // union
        const data = returnCollections.reduce((acc, v) => {
            return acc.concat([...v]);
        }, []);
        // datafunc manipulate results
        const dataFuncResults = dataFunc(data);

        // filter if text has been inputted into filter
        let filteredResults = dataFuncResults;
        if (filter && Object.values(filter).some(x => x !== '')) {
            filteredResults = data.filter((vf, i) => {// filter out the values that do not satisfy the filter
                return select.every(field => {// checks if data matches the filter or not. (all have to be satisfied by the filter text)
                    const converter = String; // string or converter
                    const ft = filter[field]?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    const rt = converter(vf.data[field])?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    return rt?.includes(ft||'');
                });
            });
        }

        // sort the results
        let sortOrder = [...groupByOrder];
        let sortBy = [...groupBy];
        sortOrder.push(orderDirection); // include orderdirection
        sortBy.push(orderBy); // include orderby
        let sortedResults = filteredResults.sort(getComparator(sortOrder, sortBy)); // sort

        // get the total length
        const filteredLength = sortedResults.length;

        // limit results
        const begin = (pageNum-1) * pageSize;
        const end = pageNum*pageSize;
        const slicedResults = sortedResults.slice(begin, end);// limit the results per page

        // group results if groupby exists
        const groupedResults = nestedGroupBy(slicedResults, groupBy);    
        // return results
        // console.log('derek Function completed successfully');
        return {data: groupedResults, length:filteredLength, grouped: groupBy.length!==0};
        // res.status(200).send({data: returnResults, length:filteredLength});
    } catch (error) {
        console.error('derek Error fetching data:', error);
        throw new HttpsError('internal', 'Internal Server Error');
    }

});

exports.filterData = onCall({ cors: ['https://gc-roofing.web.app', "http://localhost:3000"] }, async (req) => {
    // console.log('/////////////////////////////')
    // init
    const firestore = getFirestore();
    const query = req.data;

    // params
    const collectionNames = query.collections;
    const relations = query.relations || [];
    const labels = query.labels;
    const orderBy = query.orderBy || labels[0].key;
    const orderDirection = query.orderDirection || 'asc';
    const filter = query.filter;
    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 25;
    const groupBy = query.groupBy || [];
    const groupByOrder = query.groupByOrder || [];
    const dataFunc = eval(query.dataFunc) || ((v) => v);

    // check if the collection param is correct
    if (!collectionNames) {
        throw new HttpsError('invalid-argument', "Select is required.");
    } else if (!Array.isArray(collectionNames)) {
        throw new HttpsError('invalid-argument', "Select should be a list of collections")
    }

    try {
        // get collections
        // console.log('derek ------> getting collections');
        let returnCollections = await Promise.all(collectionNames.map(async c => {
            let collectionRef = firestore.collection(c);
            let query = collectionRef.select(...labels.map(l=>l.key));
            let querySnapshot = await query.get();
            return [c, querySnapshot.docs.map(doc => ({id:doc.id, data: {...doc.data()}}))];
        }));

        // make collection object where keys are collectionName and values are the data/id
        // console.log('derek ------> make collection object');
        let collections = returnCollections.reduce((obj, v) => {
            obj[v[0]] = v[1];
            return obj;
        }, {})

        // Start joining
        // console.log('derek ------> start joining');
        let data;
        if (relations.length > 0) {
            data = collections[relations.at(0)?.collections.shift()];
            for (let relation of relations) {
                let leftData = data;
                let rightData = collections[relation.collections[0]];

                if (relation.joinType === 'inner') {
                    data = innerJoin(leftData, rightData, relation.joinOn);
                } else if (relation.joinType === 'left') {
                    data = leftJoin(leftData, rightData, relation.joinOn);
                } else if (relation.joinType === 'right') {
                    data = rightJoin(leftData, rightData, relation.joinOn);
                } else {
                    throw new HttpsError('invalid-argument', "only inner and left joins are supported");
                }
            }
        } else {
            data = [];
            for (let cn of collectionNames) {
                data.push(...collections[cn]);
            }

        }
        // console.log('derek ------> finished joining')

        // datafunc manipulate results
        const dataFuncResults = dataFunc(data);

        // filter if text has been inputted into filter
        let filteredResults = dataFuncResults;
        if (filter && Object.values(filter).some(x => x !== '')) {
            filteredResults = data.filter((vf, i) => {// filter out the values that do not satisfy the filter
                return labels.every(l => {// checks if data matches the filter or not. (all have to be satisfied by the filter text)
                    const converter = String; // string or converter
                    const ft = filter[l.key]?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    const rt = converter(vf.data[l.key])?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    return rt?.includes(ft);
                });
            });
        }

        // sort the results
        let sortOrder = [...groupByOrder];
        let sortBy = [...groupBy];
        sortOrder.push(orderDirection); // include orderdirection
        sortBy.push(orderBy); // include orderby
        let sortedResults = filteredResults.sort(getComparator(sortOrder, sortBy)); // sort

        // get the total length
        const filteredLength = sortedResults.length;

        // limit results
        const begin = (pageNum-1) * pageSize;
        const end = pageNum*pageSize;
        const slicedResults = sortedResults.slice(begin, end);// limit the results per page

        // group results if groupby exists
        const groupedResults = nestedGroupBy(slicedResults, groupBy);    

        // return results
        // console.log('derek Function completed successfully');
        return {data: groupedResults, length:filteredLength, grouped: groupBy.length!==0};
        // res.status(200).send({data: returnResults, length:filteredLength});
    } catch (error) {
        console.error('derek Error fetching data:', error);
        throw new HttpsError('internal', 'Internal Server Error');
    }

});

function descendingComparator(a, b, orders, orderObjs) {
    let i = 0;
    for (let orderObj of orderObjs) {
        const dataA = a.data;
        const dataB = b.data;
        let objA = dataA[orderObj];
        let objB = dataB[orderObj];
        let typeA = (Number(objA))
            ? Number(objA)
            : ((new Date(objA)).toString() !== "Invalid Date")
                ? new Date(objA)
                : objA;
        let typeB = (Number(objB))
            ? Number(objB)
            : ((new Date(objB)).toString() !== "Invalid Date")
                ? new Date(objB)
                : objB;

        if (typeB < typeA) {
            return (orders[i] === 'asc') ? 1 : -1;
        }
        if (typeB > typeA) {
            return (orders[i] === 'asc') ? -1 : 1;
        }

        i++;
    }

    return 0;
}

function getComparator(orders, orderObjs) {
    // 1 is ascending
    // 0 is descending
    return (a, b) => descendingComparator(a, b, orders, orderObjs);
    // return order === 'asc'
    //     ? (a, b) => -descendingComparator(a, b, orderObjs)
    //     : (a, b) => descendingComparator(a, b, orderObjs);
}


function innerJoin(leftData, rightData, joinOn) {
    let rightDataJoin = new Set(rightData.map(d => d.data[joinOn]));
    leftData = leftData.filter(d => rightDataJoin.has(d.data[joinOn])).sort(getComparator(['asc'], [joinOn]));

    let leftDataJoin = new Set(leftData.map(d => d.data[joinOn]));
    rightData = rightData.filter(d => leftDataJoin.has(d.data[joinOn])).sort(getComparator(['asc'], [joinOn]));

    return leftData.map((d, i) => {
        let omitNull = obj => {
            Object.keys(obj).filter(k => obj[k] === '').forEach(k => delete(obj[k]))
            return obj
        }

        return {
            id:d.id + rightData[i].id,
            data: {
                ...d.data,
                ...omitNull(rightData[i].data),
            }
        }
    })
}

function leftJoin(leftData, rightData, joinOn) {
    let leftDataJoin = new Set(leftData.map(d => d.data[joinOn]));
    rightData = rightData.filter(d => leftDataJoin.has(d.data[joinOn])).sort(getComparator(['asc'], [joinOn]));
    return leftData.map((d, i) => {
        let omitNull = obj => {
            if (!obj) return {};
            Object.keys(obj).filter(k => !obj[k]).forEach(k => delete(obj[k]))
            return obj
        }

        return {
            id:d.id + (rightData[i]?.id||1),
            data: {
                ...d.data,
                ...omitNull(rightData[i]?.data),
            }
        }
    })
}

function rightJoin(leftData, rightData, joinOn) {
    let rightDataJoin = new Set(rightData.map(d => d.data[joinOn]));
    leftData = leftData.filter(d => rightDataJoin.has(d.data[joinOn])).sort(getComparator(['asc'], [joinOn]));
    return rightData.map((d, i) => {
        let omitNull = obj => {
            if (obj === null) return {};
            Object.keys(obj).filter(k => obj[k] === '').forEach(k => delete(obj[k]))
            return obj
        }

        return {
            id:d.id + (leftData[i]?.id||1),
            data: {
                ...d.data,
                ...omitNull(leftData[i]?.data),
            }
        }
    })
}

function nestedGroupBy(data, keys) {
    // Use reduce to iterate over each item in the data array
    return data.reduce((acc, item) => {
        // Use another reduce to iterate over each key in the keys array
        keys.reduce((nestedAcc, key, index) => {
            // Find the existing group
            let group = nestedAcc.find(g => g.key === item.data[key]);
            // If the group doesn't exist, create a new one
            if (!group) {
                group = {
                    group:true,
                    category: key,
                    key: item.data[key],
                    value: []
                };
                nestedAcc.push(group);
            }
            // Move to the next level of nesting
            return group.value;
        }, acc).push(item);
        // Return the updated accumulator object
        return acc;
    }, []); // Start with an empty array for the outer reduce
}


// const merge = (a, b, predicate = (a, b) => a === b) => {
//     const c = [...a]; // copy to avoid side effects
//     // add all items from B to copy C if they're not already present
//     b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
//     return c;
// }






