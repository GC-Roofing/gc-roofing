import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

const collectionName = 'property';

const inputObj = {
    id: {
        field: 'id',
        label: 'Property ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    name: {
        field: 'name',
        label: 'Property Name',
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
    entity: {
        field: 'entity',
        label: 'Entity',
        value: '',
        typeFunc: String,
        relation: true,
        required: true,
        options: [],
        relatedRendering: {
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
                label: 'Zip',
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
        }
    },
};

const inputRenderList = [
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Property</Typography>
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
                        <Typography sx={{ fontWeight:'bold' }}>Property ID:</Typography>
                        <Typography>{obj.id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 2
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
    [ // row 3
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
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Entity</Typography>
                );
        },
    ],
    [ // row 4
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = obj.entity;
            const id = obj.entity.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(['entity'], 'name')} 
                        sx={{...sizing(1/2)}}
                        options={options}
                        value={{
                            id: id.value || options[0]?.data.id, // either an existing value or first option
                            label: value,
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params}
                                label={label} 
                                required={required}
                                />
                        )}
                        />
                    <Box>
                        <Typography sx={{ fontWeight:'bold' }}>Entity ID:</Typography>
                        <Typography>{id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 5
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.name;
            return (
                <TextField 
                    {...textField(['entity', 'name'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.type;
            return (
                <TextField 
                    {...textField(['entity', 'type'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    select
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
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
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.billingName;
            return (
                <TextField 
                    {...textField(['entity', 'billingName'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.billingEmail;
            return (
                <TextField 
                    {...textField(['entity', 'billingEmail'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 7
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.contactName;
            return (
                <TextField 
                    {...textField(['entity', 'contactName'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.contactEmail;
            return (
                <TextField 
                    {...textField(['entity', 'contactEmail'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 8
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.address;
            return (
                <TextField 
                    {...textField(['entity', 'address'])} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 9
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.city;
            return (
                <TextField 
                    {...textField(['entity', 'city'])} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.state;
            return (
                <TextField 
                    {...textField(['entity', 'state'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.entity.relatedRendering.zip;
            return (
                <TextField 
                    {...textField(['entity', 'zip'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
];


export default function PropertyForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Property'
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





