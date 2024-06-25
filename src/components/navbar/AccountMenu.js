import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import {auth} from '../../firebase';

import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



export default function AccountMenu({setUser, color='inherit'}) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleLogout() {
        signOut(auth).then(() => {
                // Sign-out successful.
                navigate('/login');
                setUser(null);
            }).catch((error) => {
                alert('cool')
            });

        setAnchorEl(null);
    }

    function handleClose() {
        setAnchorEl(null);
    }


    return (
        <Box>
            <IconButton 
                color={color}
                size='small' 
                edge='end'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                >
                <AccountCircleIcon fontSize='large' />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}