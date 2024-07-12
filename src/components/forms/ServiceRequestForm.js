import {useState, useEffect} from 'react';
import { doc, collection, setDoc, serverTimestamp, getDoc } from "firebase/firestore";


import {firestore} from '../../firebase';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
// import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';







export default function ServiceRequestForm({id, action}) {
    // initialize
    const collectionName = 'serviceRequest';
    const title = 'Service Request';
    const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'zip', 'jobType', 'message']; // fields
    const types = [String, String, String, String, String, String, String]; // types
    const fieldNames = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Zip Code', 'Service Requested', 'Message'];
    const required = ['firstName', 'lastName', 'email', 'phoneNumber', 'zip', 'jobType']; // required fields

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

        // try setting doc
        try {
            await setDoc(docRef, {
                createdAt: serverTimestamp(),
                ...text,
                lastEdited: serverTimestamp(),
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


    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>{title} Form</Typography>
                </Box>
                {/* Form */}
                <Box sx={{p:'1%', width:totalWidth(1)}}>
                    {/* first and last */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            sx={{ width: totalWidth(1/4), m:margin }}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            sx={{ width: totalWidth(1/4), m:margin }}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            />
                    </Box>
                    {/* email and phone */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            type='email'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/3), m:margin }}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            type='tel'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/6), m:margin }}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            />
                    </Box>
                    {/* zip and service request */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/6), m:margin }}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            />
                        <TextField 
                            size='small'
                            select
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/3), m:margin }}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
                            >
                            {['Extensive Repair', 'Leak Call', 'Preventative Maintenance', 'Repair Call', 'Reroof', 'Warranty Work'].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {/* message */}
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label={fieldNames[++fieldIndex]}
                            name={fields[fieldIndex]}
                            value={text[fields[fieldIndex]]}
                            onChange={handleChange}
                            sx={{ width: totalWidth(1/2), m:margin }}
                            multiline
                            rows={4}
                            required={required.includes(fields[fieldIndex])}
                            error={required.includes(fields[fieldIndex])&&validation&&!text[fields[fieldIndex]]}
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








