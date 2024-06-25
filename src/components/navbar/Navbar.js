import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'

import Offcanvas from './Offcanvas';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';






export default function Navbar({tabs, icon, initial, menuInitial}) {

        // states
        const [open, setOpen] = useState(false); // if menu is open
        const [value, setValue] = useState(0); // which tab to highlight
        const [anchorEl, setAnchorEl] = useState(null); // anchor for the current tab
        const [currMenu, setCurrMenu] = useState(null); // current tab that should have a menu

        // updates
        // get initial tab to be shown
        useEffect(() => {
            setValue(initial);
        }, [initial]);

        // change current tab
        function handleChange(event, newValue) {
            if (!tabs[newValue].menu) {// double checks if the tab has a menu. if does, don't highlight tab
                setValue(newValue);
            }
        }

        // Open tab menu
        function handleMenuOpen(event) {
            // stop propagation
            event.stopPropagation();
            // set menu anchor
            setAnchorEl(event.currentTarget);
            setCurrMenu(event.currentTarget.dataset.tab);
        }

        // Close tab menu
        function handleMenuClose() {
            setAnchorEl(null);
        }

        function handleToggle() {
            setOpen((prev) => !prev);
        }

        return (
            <Box>
                {/* Top menu */}
                <AppBar component="nav" position='relative' color='white' 
                    sx={{boxShadow:0}} /////////////////////////////////////////// possibly remove for shadow
                    >
                    <Toolbar variant='dense' >
                        {/* Menu icon when collapsed */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                            >
                            <MenuIcon />
                        </IconButton>
                        {/* Logo */}
                        <Box
                            sx={{ display: { xs:'none', sm: 'none', md: 'flex' } }}
                            >
                            <Box
                                component="img"
                                sx={{
                                    height: 50,
                                    // maxHeight: { xs: 233, md: 167 },
                                    // maxWidth: { xs: 350, md: 250 },
                                }}
                                alt="gc logo"
                                src="/gc-logo.png"
                                />
                        </Box>
                        {/* Grow box separating menu from logo */}
                        <Box sx={{flexGrow:1}} />
                        {/* top menu */}
                        <Box sx={{ display: { xs:'none', sm: 'none', md: 'block' } }}>
                            <Tabs 
                                value={value} 
                                onChange={handleChange} 
                                textColor="inherit"
                                TabIndicatorProps={{
                                    sx: {
                                        backgroundColor:'red.main'
                                    }
                                }}
                                sx={{
                                    minHeight:0
                                }}
                                >
                                {tabs.map((v, i) => (
                                    <Tab 
                                        label={v.name} 
                                        key={i}
                                        iconPosition='end'
                                        icon={v.menu && <ArrowDropDownRoundedIcon />} // if tab has menu show arrow
                                        component={Link} 
                                        to={v.menu || v.to} // if menu exists, then no travel
                                        sx={{minHeight:0}}
                                        onClick={v.menu && handleMenuOpen}// if no menu, then do nothing, otherwise, open
                                        data-tab={i}
                                        />
                                ))}
                            </Tabs>
                        </Box>
                        {icon}
                    </Toolbar>
                </AppBar>
                {/* Side menu when collapsed */}
                <Offcanvas title='Simply Assess' open={open} toggle={handleToggle}>
                    {tabs.map((v, i) => (
                        <ListItemButton key={i}>
                            <Box sx={{display:'flex', width:'100%', alignItems:'center'}}>
                                <Box>
                                    {v.name}
                                </Box>
                                <Box sx={{flexGrow:1, display:'flex', alignItems:'center', justifyContent:'end'}}>
                                    {v.menu && <ArrowDropDownRoundedIcon />}
                                </Box>
                            </Box>
                        </ListItemButton>
                    ))}
                </Offcanvas>
                {/* popup menu */}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                        "& .MuiPaper-root": {
                            boxShadow:3
                        }
                    }}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    >
                    {tabs[currMenu]?.menu.map((v, i) => (
                        <MenuItem
                            selected={i === menuInitial && tabs[initial] === tabs[currMenu]} // selected if current tab and menu item is selected
                            component={Link} 
                            to={v.href ? v.href : tabs[currMenu].to + '/' + v.to }
                            onClick={handleMenuClose}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor:'offGrey.main',
                                }
                            }}
                            >
                            {v.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        );
}







