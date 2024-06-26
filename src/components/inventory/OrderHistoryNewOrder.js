



import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';







export default function OrderHistoryNewOrder() {

    const widthNum = 225;
    const marginNum = 10;
    const width = widthNum + 'px';
    const margin = marginNum + 'px';

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>New Order</Typography>
                </Box>
                {/* Form */}
                <Box sx={{p:'1%', width:'fit-content'}}>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            type='datetime-local' 
                            value={new Date().toISOString().slice(0,16)}
                            size='small'
                            label='Order Date'
                            sx={{ width: (widthNum*4/3 + marginNum*2/3) + 'px', m:margin }}
                            />
                        <Autocomplete
                            // value={value}
                            // onChange={(event, newValue) => {
                            //     setValue(newValue);
                            // }}
                            // inputValue={inputValue}
                            // onInputChange={(event, newInputValue) => {
                            //   setInputValue(newInputValue);
                            // }}
                            size='small'
                            options={[
                                'ABC Supply', 'Conklin Company Inc', 'Gulfeagle Supply', 
                                'Home Depot', 'IB Roof Systems', 'Sequoia Sheet Meta (Frank Melton)', 
                                'Other',
                            ]}
                            sx={{ width: (widthNum*4/3 + marginNum*2/3) + 'px', m:margin }}
                            renderInput={(params) => <TextField {...params} label="Vendor" />}
                            />
                        <TextField 
                            size='small'
                            label='Vendor Order Number'
                            sx={{ width: (widthNum*4/3 + marginNum*2/3) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Contract Name'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                        <TextField 
                            type='datetime-local' 
                            value={new Date().toISOString().slice(0,16)}
                            size='small'
                            label='Delivery Date'
                            sx={{ width: width, m:margin }}
                            />
                        <Autocomplete
                            // value={value}
                            // onChange={(event, newValue) => {
                            //     setValue(newValue);
                            // }}
                            // inputValue={inputValue}
                            // onInputChange={(event, newInputValue) => {
                            //   setInputValue(newInputValue);
                            // }}
                            size='small'
                            options={[
                                'Single Job', 'Multiple Jobs',
                            ]}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Job Amount" />}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='CO Number'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='PO Number'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='WO Number'
                            sx={{ width: width, m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <Autocomplete
                            // value={value}
                            // onChange={(event, newValue) => {
                            //     setValue(newValue);
                            // }}
                            // inputValue={inputValue}
                            // onInputChange={(event, newInputValue) => {
                            //   setInputValue(newInputValue);
                            // }}
                            size='small'
                            options={[
                                'Warehouse', 'Property',
                            ]}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Destination" />}
                            />
                        <TextField 
                            size='small'
                            label='Address'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='City'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='State'
                            sx={{ width: (widthNum/2 - marginNum) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Zip'
                            sx={{ width: (widthNum/2 - marginNum) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='General Notes'
                            multiline
                            fullWidth
                            rows={4}
                            sx={{m:margin}}
                            />
                    </Box>
                    {/* submit button */}
                    <Box sx={{py: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <Button color='darkRed' variant='outlined' sx={{width:width}}>Submit</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}






