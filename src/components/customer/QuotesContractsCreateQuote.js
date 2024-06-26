

import QuotesContractsQuoteRequests from './QuotesContractsQuoteRequests';


import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';







export default function QuotesContractsCreateQuote() {

    const widthNum = 225;
    const marginNum = 10;
    const width = widthNum + 'px';
    const margin = marginNum + 'px';

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'100%', width:'100%', pt:'4%', display:'flex', flexDirection:'column'}}>
                {/* Title */}
                <Box sx={{display:'flex', alignItems:'center'}}>
                    <Typography variant='h5'>Submit New QO Request</Typography>
                </Box>
                {/* Form */}
                <Box sx={{p:'1%', width:'fit-content'}}>
                    <Box sx={{display:'flex', alignItems:'center'}}>
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
                            options={['Joshua Thiesen', 'Brandy Thiesen', 'Kristen Patterson', 'Eduardo Truijillo', 'Jonathan Buller']}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Assigned Estimator" />}
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
                            options={['Client Request', 'Preventative Maintenance']}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Source" required />}
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
                                'Change Order', 'Extensive Repair', 'Leak Call', 'Preventative Maintenance', 
                                'Quote / Building Inspection', 'Repair Call', 'Reroof', 'Tenant Improvements', 'Warranty Work'
                            ]}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Quote Type" required />}
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
                                'Comercial Property', 'Goverment Property', 'Multi-Family Property', 'Residential Property',
                            ]}
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} label="Property Type"  />}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            type='datetime-local' 
                            value={new Date().toISOString().slice(0,16)}
                            size='small'
                            label='Requested Date'
                            sx={{ width: width, m:margin }}
                            />
                        <Box sx={{m:margin, display:'flex'}}>
                            <Typography sx={{fontWeight:'bold'}}>Due Date:&nbsp;</Typography>
                            <Typography>{new Date().toISOString().slice(0,10)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Property Name'
                            sx={{ width: width, m:margin }}
                            required
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
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} required label="Building Range"  />}
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
                            sx={{ width: width, m:margin }}
                            renderInput={(params) => <TextField {...params} required label="Building Address"  />}
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
                            label='Notes'
                            multiline
                            fullWidth
                            rows={4}
                            sx={{m:margin}}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Related Work Order Number'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='QO Company Cam'
                            sx={{ width: width, m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='NEW QO Company Cam Link'
                            sx={{ width: width, m:margin }}
                            />
                    </Box>
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center'}}>
                        <TextField 
                            size='small'
                            label='Building ID'
                            required
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Entity ID'
                            required
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Entity Name'
                            required
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Manager ID'
                            required
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                        <TextField 
                            size='small'
                            label='Manager Name'
                            required
                            sx={{ width: (widthNum*4/5 - marginNum*1/4) + 'px', m:margin }}
                            />
                    </Box>
                    {/* Submit button */}
                    <Box sx={{pt: '1%', display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <Button color='darkRed' variant='outlined' sx={{width:width}}>Submit</Button>
                    </Box>
                </Box>
                
            </Box>
            {/* Table */}
            <Box sx={{height:'100%'}}>
                <QuotesContractsQuoteRequests />
            </Box>
        </Box>
    );
}






