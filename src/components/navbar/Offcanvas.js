import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';



export default function Offcanvas({logo, title, open, toggle, children}) {

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={toggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { sm: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
            >
            <Box onClick={toggle} sx={{ textAlign: 'center' }}>
                {/* Title */}
                <Typography variant="h6" sx={{ my: 2, display:'flex', justifyContent:'center' }}>
                    {/*{logo}*/}
                    {title}
                </Typography>
                {/* Divider */}
                <Divider />
                {/* List of tabs */}
                <List>
                    {children}
                </List>
            </Box>
        </Drawer>
    );
}