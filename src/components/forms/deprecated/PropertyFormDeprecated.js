import {useState, useEffect, useCallback} from 'react';
import { doc, collection, serverTimestamp, getDoc, runTransaction } from "firebase/firestore";
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import { httpsCallable } from "firebase/functions";


import {firestore, functions} from '../../firebase';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';



// if copy and no autocomplete, then remove transaction and uncomment setdoc. remove custom before return. remove autocomplete from return


const collectionName = 'property';
const title = 'Property';
const fields = ['name', 'address', 'city', 'state', 'zip', 'entity']; // fields
const types = [String, String, String, String, String, String]; // types
const addressList = fields.slice(1, 5);
const fieldNames = ['Property Name', 'Address', 'City', 'State', 'Zip Code', 'Entity'];
const relationships = ['buildings', 'proposals'];
const required = [...fields]; // required fields
const collectionFields = {
    entity: {
        keys: ['name', 'type', 'billingName', 'billingEmail', 'contactName', 'contactEmail', 'fullAddress', 'address']
            .concat(['city', 'state', 'zip', 'coordinates']),
        labels: ['Entity Name', 'Entity Type', 'Billing Name', 'Billing Email', 'Contact Name', 'Contact Email', 'Address']
    }
}

export default function PropertyForm({id, action}) {
    // initialize


    let fieldIndex = -1;
    const typeFuncs = Object.assign(...fields.map((k, i) => ({ [k]: types[i] }))); // type functions

    // state
    const [text, setText] = useState(Object.assign(...fields.map(k => ({ [k]: '' })))); // text field stuff
    const [validation, setValidation] = useState(false); // is submitted validation?
    const [loading, setLoading] = useState(false); // loading after submit
    const [message, setMessage] = useState(''); // message to user
    const [clearId, setClearId] = useState(false); // whether to trigger reset the id
    const [formId, setFormId] = useState(id);

    // updates
    // if no id provided, then generate id
    useEffect(() => {
        if (!formId) {
            const collectionRef = collection(firestore, collectionName);
            const docRef = doc(collectionRef);
            setFormId(`${collectionName}-` + docRef.id);
        }
    }, [clearId, formId]);

    // update form if id is provided
    useEffect(() => {
        if (id) {
            async function setFormInfo() {
                const docRef = doc(firestore, collectionName, id);
                const docSnapshot = await getDoc(docRef);
                const data = docSnapshot.data();
                const initialObjRef = Object.assign(...fields.map(k => { /////////////
                    if (id&&collectionFields[k]) {
                        const relations = collectionFields[k].relations;
                        const d = Object.keys(data).reduce((acc, key) => {
                            const includeRelations = relations?.some(v => key.includes(v));
                            if (key.includes(k)||includeRelations) {
                                const field = includeRelations ? key : key.split('_')[1];
                                acc[field] = data[key]
                                return acc;
                            }
                            return acc;
                        }, {});

                        if (Object.keys(d).length === 0) { 
                            return { [k]: null }; 
                        }

                        return {[k]: {
                            label: d.name,
                            key: d.id,
                            data: d,
                            ref: doc(firestore, k, d.id),
                        }};
                    }
                    return { [k]: null };
                }));

                Object.keys(data).forEach(v => { 
                    if (v.includes('_')) {
                        delete data[v];
                    }
                })

                setObjRef(initialObjRef); 

                setText(t => ({ 
                    ...initialObjRef,
                    ...data,
                }));
            }
            
            setFormInfo();
        }
    }, [id, clearId])

    // handlers
    // handles text change
    function handleChange({target}) {
        const value = typeFuncs[target.name](target.value);

        setText(t => ({
            ...t,
            [target.name]: value,
        }));

        // reset message
        if (message) {
            setMessage('');
        }
    }

    // if form submitted
    async function handleSubmit() {
        // check if all required fields are filled out
        if (required.some(v => text[v] === '' || text[v] === null)) {
            setValidation(v=>true);
            setMessage('Fill out required fields');
            return;
        }

        // begin loading
        setLoading(true);

        // get doc
        const docRef = doc(firestore, collectionName, formId); 
        // get full address and geocode
        const fullAddress = `${text[addressList[0]]}, ${text[addressList[1]]}, ${text[addressList[2]]} ${text[addressList[3]]}`;
        let coordinates = text['coordinates'] && {...text['coordinates']};
        if (fullAddress !== text['fullAddress']) {
            const geoFuncs = await geocode(fullAddress);
            if (!geoFuncs) {
                setValidation(v=>true);
                setMessage('Address does not exist');
                setLoading(false);
                return;
            }
            coordinates = {
                lat: geoFuncs.lat(),
                lng: geoFuncs.lng(),
            }
        }

        // build list for relationships
        let relationshipsObj = {};
        if (relationships.length > 0) {
            relationshipsObj = Object.assign(...relationships.map(k => ({ [k]: [] })));
        }


        // try setting doc
        try {
            await runTransaction(firestore, async (transaction) => {
                // get reference doc
                const objRefKeys = Object.keys(objRef).filter(v => objRef[v] !== null);
                const objDocList = await Promise.all(objRefKeys.map(key => transaction.get(objRef[key].ref)));
                // update the reference doc
                objRefKeys.forEach((key) => {
                    const relatedList = objDocList[objRefKeys.indexOf(key)].data()[collectionName+'s'];
                    if (relatedList.filter(v => v.id === docRef.id).length > 0) return;
                    transaction.update(objRef[key].ref, {
                        [collectionName+'s']: relatedList.concat(docRef)
                    });
                });

                // create related objects (denormalize)
                const fullObjRef = objRefKeys.reduce((acc, key) => {
                    // add all of the data to the object
                    Object.keys(objRef[key].data).forEach(dataKey => {
                        if (dataKey.includes('_')) {
                            acc[dataKey] = objRef[key].data[dataKey];
                        } else {
                            acc[key+'_'+dataKey] = objRef[key].data[dataKey];
                        }
                    })

                    acc[key + '_id'] = objRef[key].key;

                    delete text[key];

                    return acc;
                }, {});

                // set the current form
                transaction.set(docRef, {
                    createdAt: serverTimestamp(),
                    ...relationshipsObj,
                    ...text,
                    ...fullObjRef,
                    fullAddress: fullAddress,
                    coordinates: coordinates,
                    lastEdited: serverTimestamp(),
                }, {merge:false});
            });

            // await setDoc(docRef, {
            //     ['CreatedAt']: serverTimestamp(),
            //     ...relationshipsObj,
            //     ...text,
            //     ...entityRef,
            //     ['FullAddress']: fullAddress,
            //     ['Coordinates']: coordinates,
            //     ['LastEdited']: serverTimestamp(),
            // }, {merge:true}); // merge allows for updating and setting

            setMessage('Saved!'); // success message
            (action) ? action() : clear(); // clear screen or do the custom action
            setClearId(t=>!t);
        } catch (e) {
            setMessage('An error has occured');
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
        setValidation(false);
        setText(Object.assign(...fields.map(k => ({ [k]: '' }))));
        setFormId(null);
        setObjRef(Object.assign(...fields.map(k => ({ [k]: null }))));
        setObjList(Object.assign(...fields.map(k => ({ [k]: [] }))));
    }

    // geocode
    const geocoderLibrary = useMapsLibrary('geocoding'); // library
    async function geocode(address) {
        const geocoder = new geocoderLibrary.Geocoder();
        let gs = null;

        const gr = {
            address: address,
        };

        try {
            await geocoder.geocode(gr, (results, status) => {
                if (status === 'OK') {
                    gs = results?.at(0).geometry.location;
                } else {
                    console.log(status);
                    console.log(address)
                }
            });
        } catch (e) {console.log(e)};

        return gs;
    };

    ////////////
    // custom //

    // autocomplete stuff

    // init
    // const autoCompleteFields = ['Client', 'Management', 'Property'];
    


    // state
    const [objRef, setObjRef] = useState(Object.assign(...fields.map(k => ({ [k]: null }))));
    const [objList, setObjList] = useState(Object.assign(...fields.map(k => ({ [k]: [] }))));
    const [autoLoading, setAutoLoading] = useState(false);
    const [current, setCurrent] = useState(null);

    // get info
    const getInfo = useCallback(async (textObj, current) => {
        ////////////////////////////////// This should be a param if it is ever generalized


        const text = textObj[current]?.label;
        if (!text) return;

        try {
            // get callable function and data
            setAutoLoading(true);
            const getData = httpsCallable(functions, 'getData');
            const result = await getData({
                collections:[current], 
                pageNum:1, 
                pageSize:25, 
                orderBy:'name', 
                orderDirection:'asc', 
                filter:{name:text}, 
                select:collectionFields[current].keys,
            });
            const data = result.data; // result.data is because it is the data of the results

            setObjList(t => ({
                ...t,
                [current]: data.data,
            })); // data.data is because i have an object {data: obj, length: num}
        } catch(e) {
            console.log(e.message);
        }

        setAutoLoading(false);
    }, []);

    // delay when to actually run the function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedInfo = useCallback(debounce(getInfo, 500), [getInfo])

    // update
    useEffect(() => {
        debouncedInfo(text, current);
    }, [debouncedInfo, text, current]);


    // when selected
    function handleSelect(name) {
        return (event, value, reason) => {
            if (reason === 'selectOption') {
                const v = doc(firestore, value.key.split('-')[0], value.key);
                setObjRef(t => ({
                    ...t,
                    [name]: {
                        ...value,
                        ref: v,
                    }
                }));
                setText(t => ({
                    ...t,
                    [name]: {...value} 
                }));
            } else {
                console.log('cool')
                setObjRef(t => ({
                    ...t,
                    [name]: null
                }));
            }

            if (message) {
                setMessage('');
            }
        }
    }

    // when opened
    function handleOpen(name) {
        return () => setCurrent(name);
    }

    // when closed
    function handleClose(name) {
        return (event, reason) => {
            if (reason !== 'selectOption'&&text[name]?.label!==objRef[name]?.label) {
                setText(t => ({
                    ...t,
                    [name]: null,
                }));
                setObjRef(t => ({
                    ...t,
                    [name]: null
                }));
            }
        }
    }

    // when input changes
    function handleInputChange(name) {
        return (event, value, reason) => {
            setText(t => ({
                ...t,
                [name]: {
                    ...t[name],
                    label:value,
                },
            }));
        }
    }

    // for debounce
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    //////////////////
    // end custom
    //////////////////


    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>{title} Form</Typography>
                </Box>
                {/* Form */}
                <Box sx={{p:'1%', width:totalWidth(1)}}>
                    {/* name and id */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            sx={{ width: totalWidth(1/2), m:margin }}
                            required
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <Box>
                            <Typography sx={{ fontWeight:'bold' }}>{title} ID:</Typography>
                            <Typography>{formId}</Typography>
                        </Box>
                    </Box>
                    {/* address and full address */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/2), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <Box>
                            <Typography sx={{ fontWeight:'bold' }}>Full Address:</Typography>
                            <Typography>
                                {text[fields[fieldIndex]]}
                                {(text[fields[fieldIndex]])&&', '}
                                {text[fields[fieldIndex+1]]}
                                {(text[fields[fieldIndex+1]])&&', '}
                                {text[fields[fieldIndex+2]]}
                                {(text[fields[fieldIndex+2]])&&' '}
                                {text[fields[fieldIndex+3]]}
                            </Typography>
                        </Box>
                    </Box>
                    {/* city state zip */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/4), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/8), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/8), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                    </Box>
                    {/* entity and id */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        {/* this is a function so that field index is saved as a consistent reference for textfield */}
                        {(() => {
                            const currIndex = ++fieldIndex;
                            return (
                                <Autocomplete
                                    disablePortal
                                    autoHighlight
                                    getOptionKey={v => v.key}
                                    loading={autoLoading}
                                    options={objList[fields[currIndex]].map(v => ({
                                        label: v.data.name,
                                        key: v.id,
                                        data: v.data,
                                    }))}
                                    sx={{ width: totalWidth(1/2), m:margin }}
                                    size='small'
                                    onClose={handleClose(fields[currIndex])}
                                    onOpen={handleOpen(fields[currIndex])}
                                    onChange={handleSelect(fields[currIndex])}
                                    onInputChange={handleInputChange(fields[currIndex])}
                                    value={(text[fields[currIndex]]?.key) ? text[fields[currIndex]] : null}
                                    isOptionEqualToValue={(option, value) => option.key === value.key}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params}
                                            label={fieldNames[currIndex]} 
                                            name={fields[currIndex]}
                                            error={validation&&!text[fields[currIndex]]}
                                            />
                                    )}
                                    />
                                );
                            }
                        )()}
                        <Box>
                            <Typography sx={{ fontWeight:'bold' }}>{fieldNames[fieldIndex]} ID:</Typography>
                            <Typography>{objRef[fields[fieldIndex]]?.key}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <Paper sx={{display:'flex', flexWrap:'wrap', width:totalWidth(1/2), m:margin, boxShadow:0, border:1, borderColor:'darkRed.main'}}>
                            {collectionFields[fields[fieldIndex]]?.labels.map((v, i) => {
                                const keys = collectionFields[fields[fieldIndex]].keys;
                                return (
                                    <Box key={i} sx={{ width: totalWidth(1/4), p:margin }}>
                                        <Typography sx={{ fontWeight:'bold' }}>{v}:</Typography>
                                        <Typography sx={{ minHeight:'1.2rem', lineHeight:'1.2rem' }}>{objRef[fields[fieldIndex]]?.data[keys[i]]}</Typography>
                                    </Box>
                                );
                            })}
                            {/* Entity name and type */}
                            
                        </Paper>
                    </Box>
                    {/* Submit button */}
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:totalWidth(1/2)}}>
                        <Button 
                            color='darkRed' 
                            variant='outlined' 
                            sx={{width:totalWidth(1/8)}} 
                            onClick={handleSubmit}
                            disabled={loading}
                            >
                            Submit
                        </Button>
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:totalWidth(1/2)}}>
                        <Typography sx={{color:(message==='Saved!'?'success.main':'error.main')}} >{message}</Typography>
                    </Box>
                </Box>
                
            </Box>
        </Box>
    );
}


