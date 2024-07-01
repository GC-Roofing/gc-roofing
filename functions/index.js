/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");


initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

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

        // make collection object
        // console.log('derek ------> make collection object');
        let collections = returnCollections.reduce((obj, v) => {
            obj[v[0]] = v[1];
            return obj;
        }, {})

        // Start joining
        // console.log('derek ------> start joining');
        let data = collections[relations?.at(0)?.collections.shift() || collectionNames[0]]//.sort(getComparator('asc', relations[0].joinOn));
        for (let relation of relations) {
            let leftData = data;
            let rightData = collections[relation.collections[0]];

            if (relation.joinType === 'inner') {
                let rightDataJoin = new Set(rightData.map(d => d.data[relation.joinOn]));
                leftData = leftData.filter(d => rightDataJoin.has(d.data[relation.joinOn])).sort(getComparator('asc', relation.joinOn));

                let leftDataJoin = new Set(leftData.map(d => d.data[relation.joinOn]));
                rightData = rightData.filter(d => leftDataJoin.has(d.data[relation.joinOn])).sort(getComparator('asc', relation.joinOn));

                data = leftData.map((d, i) => {
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
            } else if (relation.joinType === 'left') {
                let leftDataJoin = new Set(rightData.map(d => d.data[relation.joinOn]));
                rightData = rightData.filter(d => leftDataJoin.has(d.data[relation.joinOn])).sort(getComparator('asc', relation.joinOn));
                data = leftData.map((d, i) => {
                    let omitNull = obj => {
                        if (!obj) return {};
                        Object.keys(obj).filter(k => obj[k] === '').forEach(k => delete(obj[k]))
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
            } else if (relation.joinType === 'right') {
                let rightDataJoin = new Set(rightData.map(d => d.data[relation.joinOn]));
                leftData = leftData.filter(d => rightDataJoin.has(d.data[relation.joinOn])).sort(getComparator('asc', relation.joinOn));
                data = rightData.map((d, i) => {
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
            } else {
                throw new HttpsError('invalid-argument', "only inner and left joins are supported");
            }
        }

        // console.log('derek ------> finished joining')

        // rest
        // const data = dataList[0];
        // console.log(`derek Data fetched: ${data.length} items`);
        // console.log(`derek data fetched: ${data[0]}`)

        let filteredResults = data;

        // filter if text has been inputted into filter
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
        
        const results = filteredResults.sort(getComparator(orderDirection, orderBy));
        const filteredLength = results.length;

        const begin = (pageNum-1) * pageSize;
        const end = pageNum*pageSize;
        const returnResults = results.slice(begin, end);// limit the results per page

        // console.log('derek Function completed successfully');
        return {data: returnResults, length:filteredLength};
        // res.status(200).send({data: returnResults, length:filteredLength});
    } catch (error) {
        console.error('derek Error fetching data:', error);
        throw new HttpsError('internal', 'Internal Server Error');
    }

});

function descendingComparator(a, b, orderObj) {
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
        return -1;
    }
    if (typeB > typeA) {
        return 1;
    }
        return 0;
}

function getComparator(order, orderObj) {
    // 1 is ascending
    // 0 is descending
    return order === 'asc'
        ? (a, b) => -descendingComparator(a, b, orderObj)
        : (a, b) => descendingComparator(a, b, orderObj);
}









