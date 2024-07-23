import {useMemo} from 'react';
import { doc, collection } from "firebase/firestore";

import {firestore} from '../../firebase';

import Forms from './Forms';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


const collectionName = 'serviceRequest';

const inputObj = {
    id: {
        field: 'id',
        label: 'Service Request ID',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    firstName: {
        field: 'firstName',
        label: 'First Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    lastName: {
        field: 'lastName',
        label: 'Last Name',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    email: {
        field: 'email',
        label: 'Email',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    phone: {
        field: 'phone',
        label: 'Phone Number',
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
    jobType: {
        field: 'jobType',
        label: 'Service Requested',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    },
    message: {
        field: 'message',
        label: 'Message',
        value: '',
        typeFunc: String,
        relation: false,
        required: true,
    }
};

const inputRenderList = [
    [ // row 1
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.firstName;
            return (
                <TextField 
                    {...textField(['firstName'])} 
                    sx={{...sizing(1/4)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.lastName;
            return (
                <TextField 
                    {...textField(['lastName'])} 
                    sx={{...sizing(1/4)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
    ],
    [ // row 2
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.email;
            return (
                <TextField 
                    {...textField(['email'])} 
                    sx={{...sizing(1/3)}} 
                    type='email'
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.phone;
            return (
                <TextField 
                    {...textField(['phone'])} 
                    sx={{...sizing(1/6)}} 
                    type='tel'
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
    ],
    [ // row 3
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.zip;
            return (
                <TextField 
                    {...textField(['zip'])} 
                    sx={{...sizing(1/6)}} 
                    label={label}
                    value={value}
                    required={required}
                    />
                );
        },
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.jobType;
            return (
                <TextField 
                    {...textField(['jobType'])} 
                    sx={{...sizing(1/3)}} 
                    select
                    label={label}
                    value={value}
                    required={required}
                    >
                    {['Extensive Repair', 'Leak Call', 'Preventative Maintenance', 'Repair Call', 'Reroof', 'Warranty Work'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                );
        },
    ],
    [ // row 4
        ({textField, obj, sizing}) => {
            const {label, value, required} = obj.message;
            return (
                <TextField 
                    {...textField(['message'])} 
                    sx={{...sizing(1/2)}} 
                    label={label}
                    value={value}
                    required={required}
                    multiline
                    rows={4}
                    />
                );
        },
    ]
];


export default function ServiceRequestForm({id}) {

    return (
        <Forms 
            id={id}
            collectionName={collectionName}
            title='Service Request'
            initialObj={inputObj}
            renderList={inputRenderList}
            />
    );
}











