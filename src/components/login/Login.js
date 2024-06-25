import {useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import {auth} from '../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';




export default function Login() {
    // initialize 
    const navigate = useNavigate(); // navigate
    const images = [ // images for login screen
        '/3-Solo-Mio-Farms-Lemoore.jpg',
        '/4-California-Custom-Stereo-Fresno.jpg',
    ]

    // state
    const [cred, setCred] = useState({ // store credentials
        email:'',
        password:'',
    });
    const [imageIndex, setImageIndex] = useState(0); // get current image index 

    // update
    // set carousel
    useEffect(() => {
        // every 5 seconds, change image
        const interval = setInterval(() => {
                setImageIndex(i => (i + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [])

    // handle input changes
    function handleChange({target}) {
        setCred({
            ...cred,
            [target.name]: target.value,
        });
    }

    // handles login when button pressed
    function handleLogin() {
        // Log user in
        signInWithEmailAndPassword(auth, cred.email, cred.password)
            .then((userCredential) => {
                // Signed in 
                navigate('/internal/home');
            })
            .catch((error) => {
                // failed to sign in
                alert(JSON.stringify(error));
            });
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
            <Paper sx={{width:'90%', height:'75%', display:'flex', borderRadius:0, boxShadow:20}}>
                {/* Carousel of images on login screen */}
                <Box sx={{overflow:'hidden', position:'relative', flexGrow:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {images.map((v, i) => (
                        <Box
                            component="img"
                            sx={{
                                height:'100%',
                                minHeight: 500,
                                opacity: imageIndex === i ? 1 : 0,
                                transition: 'opacity 2s ease',
                                position:'absolute',
                            }}
                            alt={v}
                            src={v}
                            />
                        ))}
                </Box>
                {/* login */}
                <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', width:'25rem'}}>
                    <Stack
                        spacing='1rem'
                        sx={{
                            width:'15rem',
                        }}
                        >
                        {/* Title */}
                        {/*<Typography align='center' variant='h3' sx={{color:'primary.main'}}>Login</Typography>*/}
                        <Box sx={{display:'flex', justifyContent:'center'}}>
                            <Box
                                component="img"
                                sx={{
                                    width:200,
                                }}
                                alt="gc logo"
                                src="/gc-logo.png"
                                />
                        </Box>
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
                            />
                        {/* Login button */}
                        <Button disableElevation variant='contained' color='darkRed' onClick={handleLogin} >
                            <Typography sx={{color:'white.main'}}>Login</Typography>
                        </Button>
                        {/* Options */}
                        <Box
                            sx={{
                                display:'flex',
                                justifyContent:'space-between'
                            }}
                            >
                            {/* Forgot password link */}
                            {/*<Typography variant='caption'><Link to='/create-account'>Forgot password</Link></Typography>*/}
                            {/* Create account link */}
                            {/*<Typography variant='caption'><Link to='/create-account'>Create account</Link></Typography>*/}
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}