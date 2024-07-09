import {Outlet, useLocation} from 'react-router-dom';

import {useAuth} from '../../AuthContext';

import Navbar from '../navbar/Navbar';
import AccountMenu from '../navbar/AccountMenu';
// import AssessmentList from './AssessmentList';

import Box from '@mui/material/Box';





export default function InternalNavbar() {
    // initialize 
    const {user, setUser} = useAuth(); // get user for log out
    const location = useLocation(); // get location
    // get current url location for nav tabs
    const currUrl = location.pathname.split('/').at(2); // split and get the correct nav tab string
    const currTabObj = navTabs.filter((v, i) => v.key === currUrl)[0]; // filter to get the object
    let currMenuIndex = 0; // set menu index to -1 if there is no menu
    if (currTabObj?.menu) { // checks if it has menu
        const currMenu = location.pathname.split('/').at(3); // split and get the correct menu string
        const currMenuObj = currTabObj.menu.filter((v, i) => v.key === currMenu)[0]; // filter to get menu object
        currMenuIndex = currTabObj.menu.indexOf(currMenuObj); // get menu object index
    }
    const currTabIndex = navTabs.indexOf(currTabObj); // get tab index

    return (
        <Box sx={{display:'flex', flexDirection:'column', height:'100vh', width:'100vw', overflow:'hidden'}} >
            {/* Navbar for the homepage */}
            <Navbar 
                tabs={navTabs} 
                icon={<AccountMenu setUser={setUser} user={user} />} 
                initial={currTabIndex}
                menuInitial={currMenuIndex}
                />
            {/* Content box */}
            <Box sx={{flexGrow:1, overflow:'hidden'}}>
                {/* side nav and content */}
                <Outlet />
            </Box>
        </Box>
    );
}





// nav tabs for the website

const navTabs = [
    {
        name:'Home',
        key: 'home',
        to:'home',
    },
    {
        name:'Customers',
        key: 'customers',
        to:'customers',
        menu: [
            {
                name:'Overview',
                key:'overview',
                to:'overview'
            },
            {
                name:'Quotes & Contracts',
                key:'quotes-contracts',
                to:'quotes-contracts',
            },
            {
                name:'Historical Warranties',
                key:'historical-warranties',
                to:'historical-warranties',
            },
        ]
    },
    {
        name:'Work Orders',
        key: 'work-orders',
        to:'work-orders',
        menu: [
            {
                name:'Overview',
                key:'overview',
                to:'overview'
            },
            {
                name:'Scheduling',
                key:'scheduling',
                to:'scheduling',
            },
            {
                name:'Invoicing',
                key:'invoicing',
                to:'invoicing',
            },
            {
                name:'WO - CompanyCam Status',
                key:'wo-companycam-status',
                to:'wo-companycam-status',
            },
            {
                name:'WO - Property Management Portal',
                key:'wo-property-management-portal',
                to:'wo-property-management-portal',
            },
        ]
    },
    {
        name:'PVM',
        key:'pvm',
        to:'pvm',
        menu: [
            {
                name:'Overview',
                key:'overview',
                to:'overview'
            },
            {
                name:'Annual Contracts',
                key:'annual-contracts',
                to:'annual-contracts'
            },
            {
                name:'Proposal Comparison',
                key:'proposal-comparison',
                to:'proposal-comparison',
            },
            {
                name:'Job Costing By Contract ID',
                key:'job-costing-by-contract-id',
                to:'job-costing-by-contract-id',
            },
            {
                name:'Completion Report',
                key:'completion-report',
                to:'completion-report',
            },
            {
                name:'Lead Roof Tech Aid',
                key:'lead-roof-tech-aid',
                to:'lead-roof-tech-aid',
            },
        ]
    },
    {
        name:'Inventory',
        key:'inventory',
        to:'inventory',
        menu: [
            {
                name:'Products',
                key:'products',
                to:'products'
            },
            {
                name:'Order History',
                key:'order-history',
                to:'order-history'
            },
        ]
    },
    {
        name:'Tutorials',
        key:'tutorials',
        to:'tutorials',
        menu: [
            {
                name:'Tutorial',
                key:'tutorial',
                href: 'https://capture.dropbox.com/collection/VzAeKk0ozq2KBbJY'
            },
            {
                name:'PVM Tutorial',
                key:'pvm-tutorial',
                href: 'https://capture.dropbox.com/collection/wiT3M8VbKJ9IPqpz'
            },
        ]
    },
    {
        name:'Admin',
        key:'admin',
        to:'admin',
    },
    {
        name:'Forms',
        key:'forms',
        to:'forms',
        menu: [
            {
                name:'Select Form',
                key:'select-form',
                to:'select-form'
            },
        ]
    },
]


