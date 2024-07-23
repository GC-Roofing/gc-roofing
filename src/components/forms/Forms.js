import {useState, useEffect, useCallback, useMemo} from 'react';
import { doc, collection, runTransaction, serverTimestamp, getDoc } from "firebase/firestore";
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import { httpsCallable } from "firebase/functions";

import {firestore, functions} from '../../firebase';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';


/////////// use onHIghlight to auto fill highlighted results so user can see

export default function Forms({id, collectionName, title, initialObj, renderList, onSubmit}) {
    // initialObj is as seen as above
    // onSubmit is what to do when submit is clicked. 

    // state
    const [obj, setObj] = useState(initialObj);
    const [loading, setLoading] = useState(false); // loading after submit
    const [message, setMessage] = useState(''); // message to user
    const [autoLoading, setAutoLoading] = useState(false);
    const [clearId, setClearId] = useState(false);
    const formId = useMemo(() => {
        if (id) return id; // change this so that it updates all the input obj when an id is provided
        // also make sure you save the referenced related docs so that you can remove the relationship
        // if a different doc is selected

        const collectionRef = collection(firestore, collectionName);
        const docRef = doc(collectionRef);
        obj.id.value = `${collectionName}-` + docRef.id;
        return obj.id.value;
    }, [clearId]);

    // handlers
    // handles text change
    function handleChange(fieldList) {
        return (event, value, reason) => {
            const target = event?.target;
            setObj(o => {
                let retObj = {...o}; // obj to return
                let transverseObj = retObj; // obj that is transversing
                fieldList.forEach( (field, i) => {
                    transverseObj[field] = {...transverseObj[field]};
                    if (!transverseObj[field].relation) { // if it is not a relation, then just set its value
                        const valueTyped = transverseObj[field].typeFunc(target.value); // make sure it is the right type
                        transverseObj[field].value = valueTyped;
                    } else if (i === fieldList.length - 1) { // if it is a relation and the last field, then set value and get info
                        const valueTyped = transverseObj[field].typeFunc(value); // make sure it is the right type
                        transverseObj[field].value = valueTyped;
                        getInfo(o, fieldList, transverseObj[field].relatedRendering, field, value);
                    } else { // if it is an object, then transverse to the next level
                        transverseObj[field].relatedRendering = {...transverseObj[field].relatedRendering};
                        transverseObj = transverseObj[field].relatedRendering;
                    }
                });

                return retObj;
            });
            // reset message
            if (message && reason !== 'reset') {
                setMessage('');
            }
        }
    }
    

    // if form submitted
    async function handleSubmit(event) { // use onSnapshot to make live changes to keep the form up to date
        event.preventDefault();
        // begin loading
        setLoading(true);

        // get doc
        const docRef = doc(firestore, collectionName, formId); // maybe a part of runtransaction at some point or have onSnapshot

        // try setting doc
        try {
            await runTransaction(firestore, async (transaction) => {
                let retObj = {}; // original object
                let queue = [[retObj, obj]]; // bfs queue containing [nested obj, nested rendering]
                let relationQueue = [];

                // populate retObj
                while (queue.length > 0) {
                    let [transverseRetObj, transverseObj] = queue.shift(); // get the nested obj and nested rendering

                    for (let key in transverseObj) { // iterate through all the keys of nested rendering
                        if (!transverseObj[key].relation) { // if not a relation, then set the key and value
                            transverseRetObj[key] = transverseObj[key].value;
                            if (transverseObj[key].formula) { // if formula exists, then replace the value
                                transverseRetObj[key] = await transverseObj[key].formula(transverseObj);
                            }
                        } else if (transverseObj[key].value) { // else create a new [nested obj, nested rendering] and push to queue
                            let newObj = {}
                            transverseRetObj[key] = newObj;
                            relationQueue.push({name:key, data:newObj}); // store relation obj for later updating
                            queue.push([newObj, transverseObj[key].relatedRendering]);
                        }
                    }
                }

                // Update the related docs
                // this should not be ran as a firestore function because i have access to all the objects right now. I don't
                // have to iterate in a firestore function and figure out what is a relation and what isn't
                // Get relation reference docs
                const relationObjs = await Promise.all(relationQueue.map(({name, data}) => transaction.get(doc(firestore, name, data.id))));
                // update relations and include doc ref
                relationQueue.forEach( ({name, data}, i) => {
                    const ref = relationObjs[i].ref;
                    const oldData = relationObjs[i].data();
                    transaction.update(ref, {
                        ...data,
                        // add an editing of the full address too.
                        [collectionName+'s']: (oldData[collectionName+'s']||[]).concat([docRef]),
                        lastEdited: serverTimestamp(),
                    });
                });

                // set the current form
                transaction.set(docRef, {
                    createdAt: serverTimestamp(),
                    ...retObj,
                    // fullAddress: fullAddress,
                    // coordinates: coordinates,
                    lastEdited: serverTimestamp(),
                }, {merge: Boolean(id)}); // if id is provided, it should be an update
            });

            // (onSubmit) ? onSubmit(clear) : clear(); // clear screen or do the custom action
            !id && clear();
            setMessage('Saved!'); // success message
        } catch (e) {
            setMessage('An error has occured: ' + e);
            console.log(e);
        }
        
        // finish loading
        setLoading(false);
    }


    const widthNum = 1200; // width of form
    const marginNum = 10; // margin of each field
    const margin = marginNum + 'px';
    
    // calculate total width
    function totalWidth(fraction) {
        return (widthNum * fraction - (marginNum * 2)) + 'px';
    }

    // clear form
    function clear() {
        setClearId(t=>!t);
        // clear obj values
        setObj(o => {
            let retObj = {...o}; // return obj
            let queue = [retObj]; // bfs queue
            while (queue.length > 0) {
                let transverseObj = queue.shift(); // get next item

                for (let key in transverseObj) {
                    transverseObj[key] = {...transverseObj[key]}; // create a copy of the key
                    transverseObj[key].value = '';

                    if (transverseObj[key].relation) { // copy the related rendering and then push it.
                        transverseObj[key].relatedRendering = {...transverseObj[key].relatedRendering};
                        queue.push(transverseObj[key].relatedRendering);
                    }
                }
            }

            return retObj;
        });
    }

    // get info
    const getInfo = useCallback(debounce(500, async (obj, fieldList, relatedObj, current, text) => {
        try {
            setAutoLoading(true);
            // get callable function and data
            let data = {};
            if (text) { // check if text is given
                const getData = httpsCallable(functions, 'getData');
                const result = await getData({
                    collections:[current], 
                    pageNum:1, 
                    pageSize:25, 
                    orderBy:'name', 
                    orderDirection:'asc', 
                    filter:{name:text}, 
                    select:Object.keys(relatedObj),
                });
                data = result.data; // result.data is because it is the data of the results
            } else {
                data.data = []; // removes options
            }

            setObj(o => { // update the options list
                const retObj = {...o};
                let transverseObj = retObj;
                // transverse object until you get to the correct object
                fieldList.forEach((v, i) => {
                    transverseObj[v] = {...transverseObj[v]};
                    transverseObj[v].relatedRendering = {...transverseObj[v].relatedRendering};
                    if (i < fieldList.length-1) { // if it is not the last item, keep transversing
                        transverseObj = transverseObj[v].relatedRendering;
                    } else { // else last item options are updated
                        transverseObj[v].options = data.data;
                    }
                    
                });

                return retObj;
            }); // data.data is because i have an object {data: obj, length: num}
        } catch(e) {
            console.log(e.message);
        }

        setAutoLoading(false);
    }), []);

    function handleClose(fieldList, label) {
        return (event, reason) => {
            if (reason === 'selectOption') return;
            setObj(o => {
                const retObj = {...o};
                // transverse obj
                fieldList.reduce((acc, field) => {
                    acc[field] = {...acc[field]};
                    acc[field].relatedRendering = {...acc[field].relatedRendering}
                    acc[field].value = acc[field].relatedRendering[label].value;
                    return acc[field].relatedRendering;
                }, retObj);

                return retObj;
            })
        }


    }

    // when selected
    function handleSelect(fieldList, label) { // onChange of autocomplete
        return (event, value, reason) => {
            if (reason === 'selectOption') {
                handleChange(fieldList)(event, value.data[label], 'input'); // handle the change
                // change the object with the selected info
                setObj(o => {
                    const retObj = {...o};
                    let transverseData = value.data;

                    // transverse obj
                    let transverseObj = fieldList.reduce((acc, field) => {
                        acc[field] = {...acc[field]};
                        acc[field].relatedRendering = {...acc[field].relatedRendering}
                        return acc[field].relatedRendering;
                    }, retObj);

                    // update the object
                    const queue = [[transverseObj, transverseData]]; // bfs queue [transverseObj, data]
                    while (queue.length > 0) { 
                        [transverseObj, transverseData] = queue.shift(); // deconstruct and get values

                        // update all the fields of transverse object
                        Object.keys(transverseObj).forEach(v => { 
                            transverseObj[v] = {...transverseObj[v]}; // copy
                            if (!transverseObj[v].relation) { // if not relation, update value
                                transverseObj[v].value = transverseData[v]
                            } else { // else add it
                                transverseObj[v].relatedRendering = {...transverseObj[v].relatedRendering}; // copy
                                queue.push([transverseObj[v].relatedRendering, transverseData[v]]);
                            }
                        });
                    }

                    return retObj;
                });
            } else if (reason === 'clear') {
                // event.target.value = '';
                setObj(o => {
                    const retObj = {...o};
                    // let transverseObj = retObj;

                    // transverse obj
                    let transverseObj = fieldList.reduce((acc, field) => {
                        acc[field] = {...acc[field]};
                        acc[field].relatedRendering = {...acc[field].relatedRendering}
                        return acc[field].relatedRendering;
                    }, retObj);

                    // update the object
                    const queue = [transverseObj]; // bfs queue [transverseObj, data]
                    while (queue.length > 0) { 
                        transverseObj = queue.shift(); // deconstruct and get values

                        // update all the fields of transverse object
                        Object.keys(transverseObj).forEach(v => { 
                            transverseObj[v] = {...transverseObj[v]}; // copy
                            if (!transverseObj[v].relation) { // if not relation, update value
                                transverseObj[v].value = '';
                            } else { // else add it
                                transverseObj[v].relatedRendering = {...transverseObj[v].relatedRendering}; // copy
                                queue.push(transverseObj[v].relatedRendering);
                            }
                        });
                    }

                    return retObj;
                });
            }

        }
    }

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>{title} Form</Typography>
                </Box>
                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{p:'1%', width:totalWidth(1)}}>
                        {/* render */}
                        {renderList.map((row, i) => (
                            <Box key={i} sx={{display:'flex', alignItems:'center'}}>
                                {/* rows */}
                                {row.map((Component, i) => (
                                    <Component 
                                        key={i}
                                        textField={(fieldList) => ({
                                            size:'small',
                                            onChange: handleChange(fieldList),
                                        })}
                                        autoComplete={(fieldList, label) => ({
                                            autoHighlight: true,
                                            getOptionKey: v => v.id,
                                            getOptionLabel: v => v.label || v.data?.[label] || '' ,
                                            loading: autoLoading,
                                            size: 'small',
                                            onClose: handleClose(fieldList, label),
                                            onChange: handleSelect(fieldList, label),
                                            onInputChange: handleChange(fieldList),
                                            isOptionEqualToValue: (option, value) => {
                                                if (!option) return false;
                                                return value.id === option.data?.id;
                                            }
                                        })}
                                        obj={obj}
                                        sizing={(x) => ({width:totalWidth(x), m: margin})}
                                        />
                                ))}
                            </Box>
                        ))}
                        {/* Submit button */}
                        <Box sx={{pt: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:totalWidth(1/2)}}>
                            <Button 
                                type='submit'
                                color='darkRed' 
                                variant='outlined' 
                                sx={{width:totalWidth(1/8)}} 
                                disabled={loading}
                                >
                                Submit
                            </Button>
                        </Box>
                        <Box sx={{pt: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:totalWidth(1/2)}}>
                            <Typography sx={{color:(message==='Saved!'?'success.main':'error.main')}} >{message}</Typography>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}



// for debounce
function debounce(delay, func) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


//////////// Maybe generalize it. the input will take a list of objects. each object will have a field name, a type to identify relations and possibly other things,
//////////// required, a label name, a component that takes in all the handlers and such and passes it on. This component thing
//////////// allows you to easily customize the components however you want. so basically the parent component is not a rendering
//////////// component, rather it is a handler component.
// const inputTest = {
//     name: {
//         field: 'name',
//         label: 'Name',
//         value: '',
//         type: String,
//         relation: false,
//         required: true,
//     },
//     building: {
//         field: 'building',
//         label: 'Building',
//         value: '',
//         type: String,
//         relation: true,
//         required: true,
//         options: [],
//         relatedRendering: { // this related rendering means that you need to create a separate rendering for a related field
//             id: {
//                 field: 'id',
//                 label: 'ID',
//                 value: '',
//                 type: String,
//                 relation: false,
//                 required: true,
//             },
//             name: {
//                 field: 'name',
//                 label: 'Name',
//                 value: '',
//                 type: String,
//                 relation: false,
//                 required: true,
//             },
//             property: {
//                 field: 'property',
//                 label: 'Property',
//                 value: '',
//                 type: String,
//                 relation: true,
//                 required: true,
//                 options: [],
//                 relatedRendering: { // this related rendering means that you need to create a separate rendering for a related field
//                     id: {
//                         field: 'id',
//                         label: 'ID',
//                         value: '',
//                         type: String,
//                         relation: false,
//                         required: true,
//                     },
//                     name: {
//                         field: 'name',
//                         label: 'Name',
//                         value: '',
//                         type: String,
//                         relation: false,
//                         required: true,
//                     },
//                     entity: {
//                         field: 'entity',
//                         label: 'Entity',
//                         value: '',
//                         type: String,
//                         relation: true,
//                         required: true,
//                         options: [],
//                         relatedRendering: { // this related rendering means that you need to create a separate rendering for a related field
//                             id: {
//                                 field: 'id',
//                                 label: 'ID',
//                                 value: '',
//                                 type: String,
//                                 relation: false,
//                                 required: true,
//                             },
//                             name: {
//                                 field: 'name',
//                                 label: 'Name',
//                                 value: '',
//                                 type: String,
//                                 relation: false,
//                                 required: true,
//                             },
//                         }
//                     }
//                 }
//             }
//         }
//     }
// };

// const inputRenderList = [
//     [ // row 1
//         // component 1
//         // component 2
//     ],
//     [ // row 2
//         // componet 3
//         // componet 4
//     ],
// ];

// //////////// each relation will have be an object. building will have an object that contains the information from property. rendering will be
// //////////// a re running of the loop.
// const firestoreObject = {
//     id: '12345',
//     name:'name',
//     etc: null,
//     relatedObj: {
//         id: '65432',
//         name:'name',
//         etc:null,
//         relatedObj: {
//             id: '38923',
//             name:'name',
//             etc:null,
//         }
//     },
// }

