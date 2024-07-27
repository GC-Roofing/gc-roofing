import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';


const collectionName = 'tenant';

export const inputObj = () => ({ ///////////////////////////
    id: {
        field: 'id',
        label: 'Tenant ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    name: {
        field: 'name',
        label: 'Tenant Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    type: {
        field: 'type',
        label: 'Tenant Type',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingName: {
        field: 'billingName',
        label: 'Billing Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingEmail: {
        field: 'billingEmail',
        label: 'Billing Email',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    contactName: {
        field: 'contactName',
        label: 'Contact Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    contactEmail: {
        field: 'contactEmail',
        label: 'Contact Email',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    address: {
        field: 'address',
        label: 'Address',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    city: {
        field: 'city',
        label: 'City',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    state: {
        field: 'state',
        label: 'State',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    zip: {
        field: 'zip',
        label: 'Zip Code',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    fullAddress: {
        field: 'fullAddress',
        label: 'Full Address',
        formula: (obj) => {
            return (
                obj.address.value +
                (obj.address.value&&', ') +
                obj.city.value + 
                (obj.city.value&&', ') +
                obj.state.value +
                (obj.state.value&&' ') +
                obj.zip.value
                );
        },
        typeFunc: String,
        relation: false,
        required: true,
    },
    coordinates: {
        field: 'coordinates',
        label: 'Coordinates',
        formula: async (obj) => {
            const fullAddress = obj.address.value + (obj.address.value&&', ') + obj.city.value + (obj.city.value&&', ') + obj.state.value + (obj.state.value&&' ') + obj.zip.value;
            const docRef = doc(firestore, 'geolocations', fullAddress);
            const data = getDoc(docRef);

            // if data exists, then just get the geolocation data
            if (data.exists) {
                return data.data();
            } else { // else use api to get the geolocation and store it.
                const geoFuncs = await geocode(fullAddress);
                if (!geoFuncs) throw new Error('Address is invalid');
                const coordinates = {
                    lat: geoFuncs.lat(),
                    lng: geoFuncs.lng(),
                }
                setDoc(docRef, coordinates);
                return coordinates;
            }
        },
        typeFunc: Object,
        relation: false,
        required: true,
    },
});

export const inputRenderList = (fieldList) => [
    [ // row 1
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).name;
            return (
                <>
                    <TextField 
                        {...textField(fieldList.concat(['name']))} 
                        sx={{
                            ...sizing(1/2),
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                                ? 'none'
                                : 'flex'
                        }} 
                        label={label}
                        value={value}
                        required={required}
                        />
                    <Box
                        sx={{
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                                ? 'none'
                                : 'block'
                        }} 
                        >
                        <Typography sx={{ fontWeight:'bold' }}>{getNestedObj(obj, fieldList).id.label}:</Typography>
                        <Typography>{getNestedObj(obj, fieldList).id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 2
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).type;
            return (
                <TextField 
                    {...textField(fieldList.concat(['type']))} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    select
                    label={label}
                    value={value}
                    required={required}
                    >
                    {['Business', 'Government', 'Industrial', 'Mixed', 'Non-Profit', 'Office', 'Residential', 'Retail', 'RVer'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                );
        },
    ],
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingName']))} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingEmail;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingEmail']))} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
    ],
    [ // row 4
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).contactName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['contactName']))} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).contactEmail;
            return (
                <TextField 
                    {...textField(fieldList.concat(['contactEmail']))} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
    ],
    [ // row 5
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).address;
            return (
                <>
                    <TextField 
                        {...textField(fieldList.concat(['address']))} 
                        sx={{
                            ...sizing(1/2),
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                                ? 'none'
                                : 'flex'
                        }} 
                        label={label}
                        value={value}
                        required={required}
                        />
                    <Box
                        sx={{
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                                ? 'none'
                                : 'block'
                        }} 
                        >
                        <Typography sx={{ fontWeight:'bold' }}>Full Address:</Typography>
                        <Typography>
                            {getNestedObj(obj, fieldList).fullAddress.formula(getNestedObj(obj, fieldList))}
                        </Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).city;
            return (
                <TextField 
                    {...textField(fieldList.concat(['city']))} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).state;
            return (
                <TextField 
                    {...textField(fieldList.concat(['state']))} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).zip;
            return (
                <TextField 
                    {...textField(fieldList.concat(['zip']))} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
    ],
];


export default function EntityForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Tenant'
            initialObj={inputObj()}
            renderList={inputRenderList([])}
            />
    );
}





// geocode
async function geocode(address) {
    const geocoderLibrary = await window.google.maps.importLibrary("geocoding");
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


// get nested attribute

function getNestedObj(obj, fieldList) {
    let transverseObj = obj;
    for (let key of fieldList) {
        transverseObj = transverseObj[key].relatedRendering;
    }

    return transverseObj;
}



