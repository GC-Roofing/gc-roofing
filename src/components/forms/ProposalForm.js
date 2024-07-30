import {useState, useEffect} from 'react';
import { doc, getDoc } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms, {CustomSelect} from './Forms';
import {inputObj as propertyInputObj, inputRenderList as propertyRenderList} from './PropertyForm'; //////////////////////

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';




const collectionName = 'proposal';

export const inputObj = () => ({ ///////////////////////////
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
    property: {
        field: 'property',
        label: 'Property',
        value: '',
        typeFunc: String,
        relation: true,
        required: true,
        options: [],
        relatedRendering: {
            ...propertyInputObj(),
            buildings: {
                field: 'buildings',
                label: 'Bulidings',
                value: [],
                defaultValue: [],
                typeFunc: (x) => [].concat(x),
                relation: false,
                required: false,
            }
        },
    },
    buildings: {
        field: 'buildings',
        label: 'Buildings',
        value: [],
        defaultValue: [],
        typeFunc: (x) => [].concat(x),
        relation: false,
        required: true,
    },
    addresss: {
        field: 'addresss',
        label: 'Addresses',
        value: [],
        defaultValue: [],
        typeFunc: (x) => [].concat(x),
        relation: false,
        required: true,
    }
});

export const inputRenderList = (fieldList) => [
    [ // row 1
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).name;
            return (
                <>
                    <TextField 
                        {...textField(fieldList.concat(['name']))} 
                        sx={{...sizing(1/2)}} 
                        label={label}
                        value={value}
                        required={required}
                        />
                    <Box>
                        <Typography sx={{ fontWeight:'bold' }}>Property ID:</Typography>
                        <Typography>{getNestedObj(obj, fieldList).id.value}</Typography>
                    </Box>
                </>
                );
        },
    ],
    [ // row 2
        ({textField, obj, sizing}) => {
            const {label, value, required} = getNestedObj(obj, fieldList).notes;
            return (
                <TextField 
                    {...textField(fieldList.concat(['notes']))} 
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
            const {label, value, required, options} = getNestedObj(obj, fieldList).property;
            const id = getNestedObj(obj, fieldList).property.relatedRendering.id;
            return (
                <>
                    <Autocomplete 
                        {...autoComplete(fieldList.concat(['property']), 'name')} 
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
                </>
                );
        },
    ],
    ...propertyRenderList(fieldList.concat(['property'])),
    [ // row title
        ({textField, obj, sizing}) => {
            return (
                <Typography 
                    sx={{ 
                        fontWeight:'bold', 
                        ...sizing(1/2),
                        display: (!Boolean(getNestedObj(obj, fieldList).property.relatedRendering.id.value))
                            ? 'none'
                            : 'block'
                    }}
                    >
                    Buildings
                </Typography>
                );
        },
    ],
    [ // row 4
        ({textField, obj, sizing}) => {
            return (
                <CustomSelect 
                    {...{
                        textFieldObj: textField(fieldList.concat('buildings')),
                        attributeObj: getNestedObj(obj, fieldList).buildings, 
                        options: getNestedObj(obj, fieldList.concat('property')).buildings.value,
                        sizing, 
                        fieldList: fieldList.concat('buildings'),
                        relationCollection: 'building',
                        show: Boolean(getNestedObj(obj, fieldList.concat('property')).id.value),
                        optionLabel: 'name',
                    }} 
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
                        display: (!Boolean(getNestedObj(obj, fieldList).buildings.value.length))
                            ? 'none'
                            : 'block'
                    }}
                    >
                    Addresses
                </Typography>
                );
        },
    ],
    [ // row 4
        ({textField, obj, sizing}) => {
            const currObj = getNestedObj(obj, fieldList);

            const [addressOptions, setAddressOptions] = useState([]);

            useEffect(() => {
                async function getAddresses() {
                    const options = await Promise.all(currObj.buildings.value.map(v => getDoc(doc(firestore, 'building', v))));
                    const optionData = options.map(v => v.data());
                    setAddressOptions(optionData.reduce((acc, v) => acc.concat(v.addresss), []));
                }

                getAddresses();
            }, [currObj.buildings.value]);

            return (
                <CustomSelect 
                    {...{
                        textFieldObj: textField(fieldList.concat('addresss')),
                        attributeObj: getNestedObj(obj, fieldList).addresss, 
                        options: addressOptions,
                        sizing, 
                        fieldList: fieldList.concat('addresss'),
                        relationCollection: 'address',
                        show: Boolean(currObj.buildings.value.length),
                        optionLabel: 'nameAddress',
                    }} 
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


// const CustomSelect = ({textField, obj, sizing, fieldList}) => {
//     // initialize
//     const {label, value, required} = getNestedObj(obj, fieldList).buildings;
//     const buildingOptions = getNestedObj(obj, fieldList).property.relatedRendering.buildings;

//     // state
//     const [optionObjs, setOptionObjs] = useState([]); // list of objects
//     const [checked, setChecked] = useState([]);

//     // update
//     useEffect(() => { // get the objects for all the options
//         async function getOptions() {
//             const optionList = await Promise.all(buildingOptions.value.map(v => getDoc(doc(firestore, 'building', v))));
//             setOptionObjs(optionList.map(v => v.data()));
//         }
//         getOptions();

//         // clear checked if buildingOptions is deselected
//         if (buildingOptions.value.length === 0) {
//             setChecked([]);
//         }

//     }, [buildingOptions]);

//     // handlers
//     function handleChange(value) { // this is for adding or removing selected item to the checked
//         return ({target}) => {
//             if (!checked.includes(value)) {
//                 setChecked(c => c.concat(value));
//             } else {
//                 setChecked(c => c.filter(v => v !== value));
//             }
//         }
//     }

//     return (
//         <TextField 
//             {...textField(fieldList.concat(['buildings']))} 
//             sx={{
//                 ...sizing(1/2),
//                 display: (!Boolean(getNestedObj(obj, fieldList).property.relatedRendering.id.value))
//                     ? 'none'
//                     : 'flex'
//             }}  
//             select
//             SelectProps={{
//                 multiple: true,
//                 renderValue: (selected) => (
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                         {}
//                         {checked.map((value, i) => (
//                             <Chip key={i} label={value.name} />
//                         ))}
//                     </Box>
//                 )
//             }}
//             label={label}
//             value={value}
//             required={required}
//             >
//             {optionObjs.map((obj, i) => (
//                 <MenuItem key={i} value={obj.id} onClick={handleChange(obj)}>
//                     <Checkbox checked={checked.includes(obj)}  />
//                     {obj.name}
//                 </MenuItem>
//             ))}
//         </TextField>
//         );
// }






