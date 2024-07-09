import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import { createContext, useState, useContext } from 'react';

import SideNavbar from '../navbar/SideNavbar';
// import AssessmentList from './AssessmentList';

import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';



// Context
const Context = createContext();


export default function FormSidebar() {
    // initialize
    const location = useLocation(); // get location
    const navigate = useNavigate();

    // state
    const [tabs, setTabs] = useState([]);

    // get current url location for nav tabs
    const currUrl = location.pathname.split('/').at(4); // split and get the correct nav tab string
    const currTabObj = tabs.filter((v, i) => v.key === currUrl)[0]; // filter to get the object
    const currTabIndex = tabs.indexOf(currTabObj); // get tab index

    function updateTabs(tabs) {
        setTabs(t=>tabs);
    }

    // handlers
    function handleSelect(event, value, reason) {
        if (reason === 'selectOption') {
            navigate(value.to);
        }
    }

    return (
        <Box sx={{height:'100%', width:'100%', display:'flex', flexDirection: {xs: 'column', md:'row'}, overflow:'hidden'}}>
            {/* side nav */}
            <Box sx={{height: {xs: 'none', md:'100%'}, width: {xs:'100%', md:'17%'}}}>
                <SideNavbar tabs={tabs} initial={currTabIndex} 
                    header={
                        <Autocomplete
                            disablePortal
                            autoHighlight
                            blurOnSelect
                            options={formLabels}
                            sx={{ width: '100%', px:1 }}
                            size='small'
                            renderInput={(params) => <TextField {...params} label="Forms" />}
                            onChange={handleSelect}
                            />
                        }
                    />
            </Box>
            {/* content */}
            <Box sx={{width:{xs:'100%', md:'83%'}, overflow:'hidden', height:{xs: 'none', md:'100%'}}} >
                <Context.Provider value={{tabs, updateTabs}} >
                    <Outlet />
                </Context.Provider>
            </Box>
        </Box>
    );
}


// hook to get authenticated user
export function useTabs() {
    return useContext(Context);
}


const formLabels = [
    {
        label:'Property',
        to:'property'
    },
    {
        label:'Building',
        to:'building'
    },
    {
        label:'Entity',
        to:'entity'
    },
    {
        label:'Management',
        to:'management'
    },
]




