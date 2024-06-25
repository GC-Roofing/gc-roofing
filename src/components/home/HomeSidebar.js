import {Outlet} from 'react-router-dom';

import SideNavbar from '../navbar/SideNavbar';
// import AssessmentList from './AssessmentList';

import Box from '@mui/material/Box';





export default function HomeSidebar() {


    return (
        <Box sx={{height:'100%', display:'flex', flexDirection: {xs: 'column', md:'row'}, overflow:'hidden'}}>
            {/* side nav */}
            <Box sx={{height: {xs: 'none', md:'100%'}, width: {xs:'100%', md:'17%'}}}>
                <Box sx={{height: {xs:'100%', md:'30%'}}}>
                    <SideNavbar tabs={sideTabs} initial={-1} />
                </Box>
                {/* possible weather thing */}
                {/*<Box
                    sx={{
                        width: '100%',
                        height: '500px', // Adjust the height as needed
                        border: '1px solid #ccc', // Optional: Add border to iframe
                        borderRadius: '8px', // Optional: Add border-radius for rounded corners
                        overflow: 'hidden', // Prevent overflow
                        boxShadow: 2, // Add box shadow
                    }}
                    >
                    <iframe
                        src="https://forecast7.com/en/36d75n119d77/fresno/?unit=us"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Weather Forecast"
                        />
                </Box>*/}
            </Box>
            {/* content */}
            <Box sx={{flexGrow:1, overflow:'scroll'}} >
                <Outlet />
            </Box>
        </Box>
    );
}





const sideTabs = [
    {
        name:'Customers',
        to:'../customers',
    },
    {
        name:'Work Orders',
        to:'../work-orders',
    }
]






