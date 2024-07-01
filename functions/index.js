/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");


initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.filterData = onRequest(async (req, res) => {
    console.log('////////////////////////////')
    const firestore = getFirestore();
    const query = req.query; // query.collection, query.orderBy, query.orderDirection, query.filter, query.pageNum, query.pageSize, query.labels
    const collectionName = query.collection;
    if (!collectionName) {
        return res.status(400).send('Collection name is required.');
    }

    try {
        // Perform a series of queries and data transformations
        const collectionRef = firestore.collection(collectionName);
        const querySnapshot = await collectionRef.get();
        let data = querySnapshot.docs;
        console.log(`----> ${JSON.stringify(data)}`)

        let filteredResults = data;

        // filter if text has been inputted into filter
        if (query.filter && Object.values(query.filter).some(x => x !== '')) {
            filteredResults = data.filter((vf, i) => {// filter out the values that do not satisfy the filter
                return query.labels.every(l => {// checks if data matches the filter or not. (all have to be satisfied by the filter text)
                    const converter = l.converter || String; // string or converter
                    const ft = filterText[l.key]?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    const rt = converter(vf.data()[l.key])?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                    return rt?.includes(ft);
                });
            });
        }
        
        const results = filteredResults?.sort(getComparator(query.orderDirection||'asc', query.orderBy||Object.keys(data[0].data())[0]));
        const filteredLength = results.length;

        const begin = ((query.pageNum||1)-1) * (query.pageSize||25);
        const end = (query.pageNum||1)*(query.pageSize||25);
        const returnResults = results.slice(begin, end);// limit the results per page

        res.status(200).send({data: returnResults, length:filteredLength});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }

    console.log('////////////////////////////////')
});

function descendingComparator(a, b, orderObj) {
    const dataA = a.data();
    const dataB = b.data();
    const objA = Number(dataA[orderObj]) || dataA[orderObj];
    const objB = Number(dataB[orderObj]) || dataA[orderObj];

    if (objB < objA) {
        return -1;
    }
    if (objB > objA) {
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









