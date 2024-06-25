import {Outlet, useLocation} from 'react-router-dom';

import SideNavbar from '../navbar/SideNavbar';
// import AssessmentList from './AssessmentList';

import Box from '@mui/material/Box';





export default function ProductsSidebar() {

    const location = useLocation(); // get location
    // get current url location for nav tabs
    const currUrl = location.pathname.split('/').at(4); // split and get the correct nav tab string
    const currTabObj = sideTabs.filter((v, i) => v.key === currUrl)[0]; // filter to get the object
    const currTabIndex = sideTabs.indexOf(currTabObj); // get tab index

    return (
        <Box sx={{height:'100%', width:'100%', display:'flex', flexDirection: {xs: 'column', md:'row'}, overflow:'hidden'}}>
            {/* side nav */}
            <Box sx={{height: {xs: 'none', md:'100%'}, width: {xs:'100%', md:'17%'}}}>
                <SideNavbar tabs={sideTabs} initial={currTabIndex} />
            </Box>
            {/* content */}
            <Box sx={{width:'83%', overflow:'hidden', height:{xs: 'none', md:'100%'}}} >
                <Outlet />
            </Box>
        </Box>
    );
}





const sideTabs = [
    {
        name:'Product List',
        key: 'product-list',
        to:'product-list',
    },
    {
        name:'Product Used',
        key: 'product-used',
        to:'product-used',
    },
    {
        name:'Roof Systems',
        key: 'roof-systems',
        to:'roof-systems',
    },
]






