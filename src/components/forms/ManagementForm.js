import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';


const collectionName = 'management';

export const inputObj = () => ({ ///////////////////////////
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
    type: {
        field: 'type',
        label: 'Type',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingEqualContact: {
        field: 'billingEqualContact',
        label: '',
        value: false,
        typeFunc: Boolean,
        relation: false,
        required: false,
    },
    billingFirstName: {
        field: 'billingFirstName',
        label: 'Billing First Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingLastName: {
        field: 'billingLastName',
        label: 'Billing Last Name',
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
    billingAddress: {
        field: 'billingAddress',
        label: 'Billing Address',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingCity: {
        field: 'billingCity',
        label: 'Billing City',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingState: {
        field: 'billingState',
        label: 'Billing State',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingZip: {
        field: 'billingZip',
        label: 'Billing Zip Code',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    billingFullAddress: {
        field: 'billingFullAddress',
        label: 'Billing Full Address',
        formula: (obj) => {
            return (
                obj.billingAddress.value +
                (obj.billingAddress.value&&', ') +
                obj.billingCity.value + 
                (obj.billingCity.value&&', ') +
                obj.billingState.value +
                (obj.billingState.value&&' ') +
                obj.billingZip.value
                );
        },
        typeFunc: String,
        relation: false,
        required: true,
    },
    contactFirstName: {
        field: 'contactFirstName',
        label: 'Contact First Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    contactLastName: {
        field: 'contactLastName',
        label: 'Contact Last Name',
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
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).contactFirstName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['contactFirstName']))} 
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
            const {label, value, required} = getNestedObj(obj, fieldList).contactLastName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['contactLastName']))} 
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
    ],
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).contactEmail;
            return (
                <TextField 
                    {...textField(fieldList.concat(['contactEmail']))} 
                    sx={{
                        ...sizing(1/2),
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
    [ // row 5
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
    [
        ({textField, obj, sizing}) => {
            const {value} = getNestedObj(obj, fieldList).billingEqualContact;

            function handleChange(event) {
                event.target.value = value ? '' : 'true';
                textField(fieldList.concat(['billingEqualContact'])).onChange(event);
                textField(fieldList.concat(['billingFirstName'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingLastName'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingEmail'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingAddress'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingCity'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingState'])).onChange({target: {value: ''}});
                textField(fieldList.concat(['billingZip'])).onChange({target: {value: ''}});
            }
            return (
                <Box
                    sx={{
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={handleChange}
                    >
                    <Checkbox checked={Boolean(value)} />
                    <Typography>Billing info is the same as contact info</Typography>
                </Box>
                );
        },
    ],
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingFirstName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingFirstName']))} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingLastName;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingLastName']))} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
    ],
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingEmail;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingEmail']))} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    type='email'
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
    ],
    [ // row 5
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingAddress;
            return (
                <>
                    <TextField 
                        {...textField(fieldList.concat(['billingAddress']))} 
                        sx={{
                            ...sizing(1/2),
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                                ? 'none'
                                : 'flex'
                        }}  
                        label={label}
                        value={value}
                        required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                        />
                    <Box
                        sx={{
                            display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                                ? 'none'
                                : 'block'
                        }}  
                        >
                        <Typography sx={{ fontWeight:'bold' }}>Full Billing Address:</Typography>
                        <Typography>
                            {getNestedObj(obj, fieldList).billingFullAddress.formula(getNestedObj(obj, fieldList))}
                        </Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 6
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingCity;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingCity']))} 
                    sx={{
                        ...sizing(1/4),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingState;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingState']))} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).billingZip;
            return (
                <TextField 
                    {...textField(fieldList.concat(['billingZip']))} 
                    sx={{
                        ...sizing(1/8),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value) || getNestedObj(obj, fieldList).billingEqualContact.value)
                            ? 'none'
                            : 'flex'
                    }}  
                    label={label}
                    value={value}
                    required={required && !getNestedObj(obj, fieldList).billingEqualContact.value}
                    />
                );
        },
    ],
];


export default function ManagementForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Management'
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

