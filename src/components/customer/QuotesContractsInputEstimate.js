



import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';







export default function QuotesContractsInputEstimate() {

    const widthNum = 225;
    const marginNum = 10;
    const width = widthNum + 'px';
    const margin = marginNum + 'px';

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>Input New Quote</Typography>
                </Box>
                {/* Form */}
                <Box sx={{p:'1%', width:'fit-content'}}>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Quote ID'
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Building ID'
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Quote Source'
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Quote Type'
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Proposal Type'
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Manager Name'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Manager Entity'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Property Name'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Building Range'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Building Address'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Building City'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Building State'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Building Zip'
                            sx={{ width: width, m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Assigned Estimator'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Work Order Number Related'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Tech Notes'
                            multiline
                            fullWidth
                            rows={4}
                            sx={{m:margin}}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            type='datetime-local' 
                            value={new Date().toISOString().slice(0,16)}
                            size='small'
                            label='Proposal Date'
                            sx={{ width: (widthNum*2 + marginNum*2) + 'px', m:margin }}
                            />
                        <Box sx={{m:margin, display:'flex'}}>
                            <Typography sx={{fontWeight:'bold'}}>Proposal Expiration:&nbsp;</Typography>
                            <Typography>{new Date().toISOString().slice(0,10)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Dropbox Link'
                            multiline
                            fullWidth
                            rows={2}
                            sx={{m:margin}}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Product ID'
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
                                'Elastomeric Coating System', 'Fabric Reinforced System', 'Foam System', 
                                'Inspection', 'Membrane Coating System', 'Metal Replacement', 'Metal Restoration System',
                                'Preventative Maintenance', 'Preventative Maintenance1', 'Repair', 'Rolled Roofing', 
                                'Shingles', 'Single Ply System', 'Warranty',
                            ]}
                            sx={{ width: (widthNum*3/2 + marginNum*2) + 'px', m:margin }}
                            renderInput={(params) => <TextField {...params} label="Roof System" />}
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
                            options={[]}
                            sx={{ width: (widthNum*3/2 + marginNum*2) + 'px', m:margin }}
                            renderInput={(params) => <TextField {...params} label="Roof Manufacturer" />}
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
                            options={['Under Warranty', 'Warranty Roof Maintenance Inspection Report']}
                            sx={{ width: (widthNum*5/2+marginNum*4) + 'px', m:margin }}
                            renderInput={(params) => <TextField {...params} label="Roof Product Name" />}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Internal Comments'
                            multiline
                            fullWidth
                            rows={4}
                            sx={{m:margin}}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Close Quote'
                            sx={{width:width, m:margin}}
                            />
                    </Box>
                    {/* submit button */}
                    <Box sx={{py: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <Button color='darkRed' variant='outlined' sx={{width:width}}>Submit</Button>
                    </Box>
                </Box>
                {/* Extra info */}
                <Box sx={{display:'flex', flexDirection:'column', py:'1%'}}>
                    <Typography variant='body' sx={{fontWeight:'bold', mb:'1rem'}}>Payment Breakdown Criteria</Typography>
                    <Typography variant='body'>
                        Initial for non-residential customers should be 20%. 
                        Residential downpayment is 10% or $1,000 (whichever is lesser). 
                    </Typography>
                    <ul style={{marginBottom:'2rem'}}>
                        <li><Typography variant='body'>$1 – $5,000 = 1 Payment</Typography></li>
                        <li><Typography variant='body'>$5,001 – $35,000 = 2 Payments</Typography></li>
                        <li><Typography variant='body'>$35,001 – $75,000 = 3 Payments</Typography></li>
                        <li><Typography variant='body'>$75,000 + $150,000 = 4 Payments</Typography></li>
                        <li><Typography variant='body'>$150,000 = TBD </Typography></li>
                    </ul>
                </Box>
            </Box>
        </Box>
    );
}






