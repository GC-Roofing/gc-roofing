import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';


const collectionName = 'entity';

const inputObj = {
    id: {
        field: 'id',
        label: 'Entity ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    name: {
        field: 'name',
        label: 'Entity Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    type: {
        field: 'type',
        label: 'Entity Type',
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
};

const inputRenderList = [
    [ // row title
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.name;
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Entity</Typography>
                );
        },
    ],
    [ // row 1
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.name;
            return (
                <>
                    <TextField 
                        {...textField(['name'])} 
                        sx={{...sizing(1/2)}} 
                        label={label}
                        value={value}
                        required={required}
                        />
                    <Box>
                        <Typography sx={{ fontWeight:'bold' }}>{obj.id.label}:</Typography>
                        <Typography>{obj.id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 2
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.type;
            return (
                <TextField 
                    {...textField(['type'])} 
                    sx={{...sizing(1/2)}} 
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
            const {label, value, required} = obj.billingName;
            return (
                <TextField 
                    {...textField(['billingName'])} 
                    sx={{...sizing(1/6)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.billingEmail;
            return (
                <TextField 
                    {...textField(['billingEmail'])} 
                    sx={{...sizing(1/3)}} 
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
            const {label, value, required} = obj.contactName;
            return (
                <TextField 
                    {...textField(['contactName'])} 
                    sx={{...sizing(1/6)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.contactEmail;
            return (
                <TextField 
                    {...textField(['contactEmail'])} 
                    sx={{...sizing(1/3)}} 
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
            const {label, value, required} = obj.address;
            return (
                <>
                    <TextField 
                        {...textField(['address'])} 
                        sx={{...sizing(1/2)}} 
                        label={label}
                        value={value}
                        required={required}
                        />
                    <Box>
                        <Typography sx={{ fontWeight:'bold' }}>Full Address:</Typography>
                        <Typography>
                            {obj.fullAddress.formula(obj)}
                        </Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.city;
            return (
                <TextField 
                    {...textField(['city'])} 
                    sx={{...sizing(1/4)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.state;
            return (
                <TextField 
                    {...textField(['state'])} 
                    sx={{...sizing(1/8)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.zip;
            return (
                <TextField 
                    {...textField(['zip'])} 
                    sx={{...sizing(1/8)}} 
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
            title='Entity'
            initialObj={inputObj}
            renderList={inputRenderList}
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





