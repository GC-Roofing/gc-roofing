
const {getFirestore} = require("firebase-admin/firestore");
const { HttpsError} = require("firebase-functions/v2/https");

exports.getData = async (req) => {
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

}



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
