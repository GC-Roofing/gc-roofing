import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

const collectionName = 'proposal';

const inputObj = {
    id: {
        field: 'id',
        label: 'Proposal ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    name: {
        field: 'name',
        label: 'Proposal Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    notes: {
        field: 'notes',
        label: 'Notes',
        value: '',
        typeFunc: String,
        relation: false,
        required: false,
    },
    tenant: {
        field: 'tenant',
        label: 'Tenant',
        value: '',
        typeFunc: String,
        relation: true,
        required: false,
        options: [],
        relatedRendering: {
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
    management: {
        field: 'management',
        label: 'Management',
        value: '',
        typeFunc: String,
        relation: true,
        required: false,
        options: [],
        relatedRendering: {
            id: {
                field: 'id',
                label: 'Management ID',
                value: '',
                typeFunc: String,
                relation: false,
                required: true,
            },
            name: {
                field: 'name',
                label: 'Management Name',
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
    property: {
        field: 'property',
        label: 'Property',
        value: '',
        typeFunc: String,
        relation: true,
        required: true,
        options: [],
        relatedRendering: {
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
                        label: 'Entity Address',
                        value: '',
                        typeFunc: String,
                        relation: false,
                        required: true,
                    },
                    city: {
                        field: 'city',
                        label: 'Entity City',
                        value: '',
                        typeFunc: String,
                        relation: false,
                        required: true,
                    },
                    state: {
                        field: 'state',
                        label: 'Entity State',
                        value: '',
                        typeFunc: String,
                        relation: false,
                        required: true,
                    },
                    zip: {
                        field: 'zip',
                        label: 'Entity Zip',
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
                },
            },
        },
    },
};

const inputRenderList = [
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Proposal</Typography>
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
            const {label, value, required} = obj.notes;
            return (
                <TextField 
                    {...textField(['notes'])} 
                    sx={{...sizing(1/2)}} 
                    label={label}
                    value={value}
                    required={required}
                    multiline
                    rows={4}
                    />
                );
        },
    ],
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Property</Typography>
                );
        },
    ],
    [ // row 4
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = obj.property;
            const id = obj.property.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(['property'], 'name')} 
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
                        <Typography sx={{ fontWeight:'bold' }}>Property ID:</Typography>
                        <Typography>{id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 5
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.name;
            return (
                <TextField 
                    {...textField(['property', 'name'])} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.address;
            return (
                <TextField 
                    {...textField(['property', 'address'])} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 7
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.city;
            return (
                <TextField 
                    {...textField(['property', 'city'])} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.state;
            return (
                <TextField 
                    {...textField(['property', 'state'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.zip;
            return (
                <TextField 
                    {...textField(['property', 'zip'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography sx={{ 
                    fontWeight:'bold', 
                    ...sizing(1/2),
                    display: (!Boolean(obj.property.relatedRendering.id.value))
                        ? 'none'
                        : 'flex'
                }}
                    >
                    Entity
                </Typography>
                );
        },
    ],
    [ // row 8
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = obj.property.relatedRendering.entity;
            const id = obj.property.relatedRendering.entity.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(['property', 'entity'], 'name')} 
                        sx={{
                            ...sizing(1/2),
                            display: (!Boolean(obj.property.relatedRendering.id.value))
                                ? 'none'
                                : 'flex'
                        }} 
                        options={options}
                        disabled={!Boolean(obj.property.relatedRendering.id.value)}
                        value={{
                            id: id.value || options[0]?.data.id, // either an existing value or first option
                            label: value || obj.property.relatedRendering.entity.relatedRendering.name.value,
                        }}
                        renderInput={(params) => (
                            <TextField 
                                {...params}
                                label={label} 
                                required={required}
                                />
                        )}
                        />
                    <Box sx={{
                        display: (!Boolean(obj.property.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                        }}
                        >
                        <Typography sx={{ fontWeight:'bold' }}>Entity ID:</Typography>
                        <Typography>{id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 9
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.name;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'name'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.type;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'type'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    select
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
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
    [ // row 10
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.billingName;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'billingName'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.billingEmail;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'billingEmail'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 11
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.contactName;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'contactName'])} 
                    sx={{
                        ...sizing(1/6),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.contactEmail;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'contactEmail'])} 
                    sx={{
                        ...sizing(1/3),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 12
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.address;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'address'])} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 13
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.city;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'city'])} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.state;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'state'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.property.relatedRendering.entity.relatedRendering.zip;
            return (
                <TextField 
                    {...textField(['property', 'entity', 'zip'])} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value))
                            ? 'none'
                            : 'flex'
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.property.relatedRendering.entity.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row title
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.name;
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Tenant</Typography>
                );
        },
    ],
    [ // row 3
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = obj.tenant;
            const id = obj.tenant.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(['tenant'], 'name')} 
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
                        <Typography sx={{ fontWeight:'bold' }}>Tenant ID:</Typography>
                        <Typography>{id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 4
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.name;
            return (
                <TextField 
                    {...textField(['tenant', 'name'])} 
                    sx={{
                        ...sizing(1/3), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.type;
            return (
                <TextField 
                    {...textField(['tenant', 'type'])} 
                    sx={{
                        ...sizing(1/6), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    select
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
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
    [ // row 5
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.billingName;
            return (
                <TextField 
                    {...textField(['tenant', 'billingName'])} 
                    sx={{
                        ...sizing(1/6), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.billingEmail;
            return (
                <TextField 
                    {...textField(['tenant', 'billingEmail'])} 
                    sx={{
                        ...sizing(1/3), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.contactName;
            return (
                <TextField 
                    {...textField(['tenant', 'contactName'])} 
                    sx={{
                        ...sizing(1/6), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.contactEmail;
            return (
                <TextField 
                    {...textField(['tenant', 'contactEmail'])} 
                    sx={{
                        ...sizing(1/3), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 7
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.address;
            return (
                <TextField 
                    {...textField(['tenant', 'address'])} 
                    sx={{
                        ...sizing(1/2), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 8
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.city;
            return (
                <TextField 
                    {...textField(['tenant', 'city'])} 
                    sx={{
                        ...sizing(1/4), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.state;
            return (
                <TextField 
                    {...textField(['tenant', 'state'])} 
                    sx={{
                        ...sizing(1/8), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.tenant.relatedRendering.zip;
            return (
                <TextField 
                    {...textField(['tenant', 'zip'])} 
                    sx={{
                        ...sizing(1/8), 
                        display: (!Boolean(obj.tenant.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.tenant.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row title
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.name;
            return (
                <Typography sx={{ fontWeight:'bold', ...sizing(1/2)}}>Management</Typography>
                );
        },
    ],
    [ // row 9
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = obj.management;
            const id = obj.management.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(['management'], 'name')} 
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
                        <Typography sx={{ fontWeight:'bold' }}>Management ID:</Typography>
                        <Typography>{id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 10
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.name;
            return (
                <TextField 
                    {...textField(['management', 'name'])} 
                    sx={{
                        ...sizing(1/2), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 11
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.billingName;
            return (
                <TextField 
                    {...textField(['management', 'billingName'])} 
                    sx={{
                        ...sizing(1/6), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.billingEmail;
            return (
                <TextField 
                    {...textField(['management', 'billingEmail'])} 
                    sx={{
                        ...sizing(1/3), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 12
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.contactName;
            return (
                <TextField 
                    {...textField(['management', 'contactName'])} 
                    sx={{
                        ...sizing(1/6), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.contactEmail;
            return (
                <TextField 
                    {...textField(['management', 'contactEmail'])} 
                    sx={{
                        ...sizing(1/3), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 13
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.address;
            return (
                <TextField 
                    {...textField(['management', 'address'])} 
                    sx={{
                        ...sizing(1/2), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
    ],
    [ // row 14
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.city;
            return (
                <TextField 
                    {...textField(['management', 'city'])} 
                    sx={{
                        ...sizing(1/4), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.state;
            return (
                <TextField 
                    {...textField(['management', 'state'])} 
                    sx={{
                        ...sizing(1/8), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.management.relatedRendering.zip;
            return (
                <TextField 
                    {...textField(['management', 'zip'])} 
                    sx={{
                        ...sizing(1/8), 
                        display: (!Boolean(obj.management.relatedRendering.id.value))
                            ? 'none'
                            : 'flex',
                    }} 
                    label={label}
                    value={value}
                    required={required}
                    disabled={!Boolean(obj.management.relatedRendering.id.value)}
                    />
                );
        },
    ],
];


export default function BuildingForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Proposal'
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





