import {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {auth} from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";


import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';




export default function CreateAccount() {
    // initialize
    const navigate = useNavigate(); // navigate

    // states
    const [cred, setCred] = useState({ // save credentials
        email:'',
        password:'',
        confirm:'',
    });
    const [match, setMatch] = useState(false); // check if match

    // check input changes
    function handleChange({target}) {
        setCred({
            ...cred,
            [target.name]: target.value,
        });
    }

    // handle when sign up button is clicked
    function handleSignUp() {
        if (cred.password === cred.confirm && cred.email && cred.password) {
            // Sign user in if everything is good
            createUserWithEmailAndPassword(auth, cred.email, cred.password)
                .then((userCredential) => {
                    // Signed up 
                    console.log('success');
                })
                .catch((error) => {
                    console.log(error);
                });

            // Navigate to login
            navigate('/')
        } else {
            // passwords did not match
            setMatch(true);
        }
    }

    return (
        <Container
            maxWidth='lg'
            sx={{
                height:'100vh',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
            }} 
            >
            <Stack
                spacing='1rem'
                sx={{
                    width:'20rem',
                }}
                >
                {/* Title */}
                <Typography align='center' variant='h3' sx={{color:'primary.main'}}>Sign up</Typography>
                {/* Email */}
                <TextField
                    fullWidth
                    name='email'
                    label='Email'
                    value={cred.email}
                    onChange={handleChange}
                    />
                {/* Password */}
                <TextField
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    value={cred.password}
                    onChange={handleChange}
                    error={match}
                    />
                {/* Confirm password */}
                <TextField
                    fullWidth
                    name='confirm'
                    label='Confirm'
                    type='password'
                    value={cred.confirm}
                    onChange={handleChange}
                    error={match}
                    />
                {/* Sign up */}
                <Button disableElevation variant='contained' onClick={handleSignUp}>Sign up</Button>
                {/* Go back to login */}
                <Typography align='right' variant='caption'><Link to='/'>Back to login</Link></Typography>
            </Stack>
        </Container>
    );
}