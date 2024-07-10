import {useState, useEffect, useCallback} from 'react';
import { doc, collection, serverTimestamp, getDoc, runTransaction } from "firebase/firestore";
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import { httpsCallable } from "firebase/functions";


import {firestore, functions} from '../../firebase';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';



// if copy and no autocomplete, then remove transaction and uncomment setdoc. remove custom before return. remove autocomplete from return




export default function PropertyForm({id, action}) {
    // initialize
    const collectionName = 'property';
    const title = 'Property';
    const fields = ['name', 'entity', 'address', 'city', 'state', 'zip']; // fields
    const types = [String, String, String, String, String, String]; // types
    const addressList = fields.slice(2, 6);
    const fieldNames = ['Property Name', 'Entity', 'Address', 'City', 'State', 'Zip Code'];
    const relationships = ['transactions', 'buildings'];
    const required = [...fields]; // required fields

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

                setText({
                    ...data,
                });
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
                const objDocList = await Promise.all(objRefKeys.map(key => transaction.get(objRef[key])));

                // update the reference doc
                objRefKeys.forEach((key) => {
                    transaction.update(objRef[key], {
                        [collectionName+'s']: objDocList[objRefKeys.indexOf(key)].data()[collectionName+'s'].concat(docRef)
                    });
                });

                // set the current form
                transaction.set(docRef, {
                    createdAt: serverTimestamp(),
                    ...relationshipsObj,
                    ...text,
                    ...Object.fromEntries(Object.entries(objRef).filter(([_, v]) => v !== null)),
                    fullAddress: fullAddress,
                    coordinates: coordinates,
                    lastEdited: serverTimestamp(),
                }, {merge:true});
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
        const splitValue = 'client';
        const splitValueValues = ['entity', 'tenant'];


        const text = textObj[current]?.label;
        if (!text) return;

        // if a column can have multiple values
        let multiple;
        if (current === splitValue) {
            multiple = splitValueValues;
        }

        try {
            // get callable function and data
            setAutoLoading(true);
            const filterData = httpsCallable(functions, 'filterData');
            const result = await filterData({
                collections:multiple || [current], 
                pageNum:1, 
                pageSize:25, 
                orderBy:'name', 
                orderDirection:'asc', 
                filter:{name:text}, 
                labels:[{key:'name'}],
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
                    [current]: v
                }));
                setText(t => ({
                    ...t,
                    [current]: {...value} 
                }));
            } else {
                setObjRef(t => ({
                    ...t,
                    [current]: null
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

    // when input changes
    function handleInputChange(name) {
        return (event, value, reason) => {
            setText(t => ({
                ...t,
                [name]: {
                    label:value,
                    key: null,
                },
            }));

            if (value==='') {
                setText(t => ({
                    ...t,
                    [name]: null,
                }));
            }

            // reset message
            // if (message) {
            //     setMessage('');
            // }
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
                                    }))}
                                    sx={{ width: totalWidth(1/2), m:margin }}
                                    size='small'
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
                            <Typography>{objRef[fields[fieldIndex]]?.id}</Typography>
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
                            <Typography>{text[fields[fieldIndex]]||'[address]'}, {text[fields[fieldIndex+1]]||'[city]'}, {text[fields[fieldIndex+2]]||'[state]'} {text[fields[fieldIndex+3]]||'[zip]'}</Typography>
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


