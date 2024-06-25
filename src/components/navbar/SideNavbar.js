import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'



import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


export default function SideNavbar({tabs, initial=0}) {
    const [value, setValue] = useState(initial);


    // updates
    // get initial tab to be shown
    useEffect(() => {
        setValue(initial);
    }, [initial]);

    function handleChange(event, newValue) {
        setValue(newValue);
    };


    return (
        <Box sx={{py:{xs:'5%', md:'20%'}, px:'10%', height:'100%', width:'100%'}}>
            <Paper sx={{bgcolor:'offGrey.main', py:'5%'}}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    textColor="inherit"
                    orientation='vertical'
                    TabIndicatorProps={{
                        sx: {
                            backgroundColor:'red.main'
                        }
                    }}
                    >
                    {tabs.map((v, i) => (
                        <Tab key={i} label={v.name} component={Link} to={v.to} sx={{width:'100%', minWidth:'100%', maxWidth:'100%'}} />
                    ))}
                </Tabs>
            </Paper>
        </Box>
    );
}