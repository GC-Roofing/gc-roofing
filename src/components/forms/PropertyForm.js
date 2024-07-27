import { doc, getDoc, setDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';
import {inputObj as entityInputObj, inputRenderList as entityRenderList} from './EntityForm'; //////////////////////

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const collectionName = 'property';

export const inputObj = () => ({ ///////////////////////////
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
            ...entityInputObj(), /////////////////////////////////
        }
    },
});

export const inputRenderList = (fieldList) => [ ///////////////////////////////
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
                        <Typography sx={{ fontWeight:'bold' }}>Property ID:</Typography>
                        <Typography>{getNestedObj(obj, fieldList).id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 2
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
    [ // row 3
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
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography 
                    sx={{ 
                        fontWeight:'bold', 
                        ...sizing(1/2),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }}
                    >
                    Entity
                </Typography>
                );
        },
    ],
    [ // row 4
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = getNestedObj(obj, fieldList).entity;
            const id = getNestedObj(obj, fieldList).entity.relatedRendering.id;
            return (
                <Autocomplete 
                    {...autoComplete(fieldList.concat(['entity']), 'name')} 
                    sx={{
                        ...sizing(1/2),
                        display: (!Boolean(getNestedObj(obj, fieldList).id.value))
                            ? 'none'
                            : 'flex'
                    }}
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
                );
        },
    ],
    ...entityRenderList(fieldList.concat(['entity'])),
];


export default function PropertyForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Property'
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


