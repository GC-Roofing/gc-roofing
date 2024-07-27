import Forms from './Forms';
import {inputObj as propertyInputObj, inputRenderList as propertyRenderList} from './PropertyForm'; //////////////////////

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const collectionName = 'building';

export const inputObj = () => ({ ///////////////////////////
    id: {
        field: 'id',
        label: 'Building ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    name: {
        field: 'name',
        label: 'Building Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
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
            ...propertyInputObj()
        },
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
                        <Typography sx={{ fontWeight:'bold' }}>Building ID:</Typography>
                        <Typography>{getNestedObj(obj, fieldList).id.value}</Typography>
                    </Box>
                </>
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
                            : 'block'
                    }}
                    >
                    Property
                </Typography>
                );
        },
    ],
    [ // row 4
        ({autoComplete, obj, sizing}) => {
            const {label, value, required, options} = getNestedObj(obj, fieldList).property;
            const id = getNestedObj(obj, fieldList).property.relatedRendering.id;
            return (
                <Autocomplete 
                    {...autoComplete(fieldList.concat(['property']), 'name')} 
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
    ...propertyRenderList(fieldList.concat(['property']))
];


export default function BuildingForm({id}) {
    

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Building'
            initialObj={inputObj()}
            renderList={inputRenderList([])}
            />
    );
}





// geocode
// async function geocode(address) {
//     const geocoderLibrary = await window.google.maps.importLibrary("geocoding");
//     const geocoder = new geocoderLibrary.Geocoder();
//     let gs = null;

//     const gr = {
//         address: address,
//     };

//     try {
//         await geocoder.geocode(gr, (results, status) => {
//             if (status === 'OK') {
//                 gs = results?.at(0).geometry.location;
//             } else {
//                 console.log(status);
//                 console.log(address)
//             }
//         });
//     } catch (e) {console.log(e)};

//     return gs;
// };

// get nested attribute

function getNestedObj(obj, fieldList) {
    let transverseObj = obj;
    for (let key of fieldList) {
        transverseObj = transverseObj[key].relatedRendering;
    }

    return transverseObj;
}
















