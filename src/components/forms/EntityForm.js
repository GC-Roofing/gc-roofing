import {useState, useEffect} from 'react';
import { doc, collection, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import {useMapsLibrary} from '@vis.gl/react-google-maps';


import {firestore} from '../../firebase';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';







export default function EntityForm({id, action}) {
    // initialize
    const collectionName = 'entity';
    const title = 'Entity';
    const fields = ['name', 'type', 'billingName', 'billingEmail', 'contactName', 'contactEmail', 'address', 'city', 'state', 'zip']; // fields
    const types = [String, String, String, String, String, String, String, String, String, String]; // types
    const addressList = fields.slice(4, 8);
    const fieldNames = ['Entity Name', 'Type', 'Billing Name', 'Billing Email', 'Contact Name', 'Contact Email', 'Address', 'City', 'State', 'Zip Code'];
    const relationships = ['propertys', 'transactions'];
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
    // building id is either pregiven or auto generated
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
        if (required.some(v => text[v] === '')) {
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
            await setDoc(docRef, {
                ['createdAt']: serverTimestamp(),
                ...relationshipsObj,
                ...text,
                ['fullAddress']: fullAddress,
                ['coordinates']: coordinates,
                ['lastEdited']: serverTimestamp(),
            }, {merge:true}); // merge allows for updating and setting

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
                    {/* type */}
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
                    </Box>
                    {/* billing name and email */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/6), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(2/6), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                    </Box>
                    {/* contact name and email */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/6), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(2/6), m:margin }}
                            required
                            error={validation&&!text[fields[fieldIndex]]}
                            />
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








