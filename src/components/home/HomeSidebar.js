import {useEffect} from 'react';
import {Outlet} from 'react-router-dom';

import SideNavbar from '../navbar/SideNavbar';
// import AssessmentList from './AssessmentList';

import Box from '@mui/material/Box';





export default function HomeSidebar() {
    useEffect(() => {
        const script = document.createElement('script');
        script.id = 'weatherwidget-io-js';
        script.src = 'https://weatherwidget.io/js/widget.min.js';
        script.async = true;
        document.head.appendChild(script);

        return () => {
          document.head.removeChild(script);
        };
  }, []);

    return (
        <Box sx={{height:'100%', display:'flex', flexDirection: {xs: 'column', md:'row'}, overflow:'hidden'}}>
            {/* side nav */}
            <Box sx={{height: {xs: 'none', md:'100%'}, width: {xs:'100%', md:'17%'}}}>
                <Box sx={{height: {xs:'100%', md:'30%'}}}>
                    <SideNavbar tabs={sideTabs} initial={false} />
                </Box>
                {/* possible weather thing */}
                <Box
                    sx={{
                        width: '100%',
                        height: {xs:'100%', md:'70%'}, // Adjust the height as needed
                        px:'10%',
                        pb:'10%',
                        overflow:'hidden',
                    }}
                    >
                    <Box
                        sx={{
                            width:'100%',
                            height:'100%',
                            overflow:'scroll',
                        }}
                        >
                        <a className="weatherwidget-io" href="https://forecast7.com/en/36d75n119d77/fresno/?unit=us"  data-label_1="FRESNO" data-label_2="WEATHER" data-font="Roboto" data-theme="pure" >FRESNO WEATHER</a>
                    </Box>
                </Box>
            </Box>
            {/* content */}
            <Box sx={{width:{xs:'100%', md:'83%'}, overflow:'scroll', height:{xs: 'none', md:'100%'}}} >
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






