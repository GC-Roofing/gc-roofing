import { writeBatch, doc } from "firebase/firestore"; 
import {useState} from 'react';

import {useAuth} from '../../AuthContext';
import {firestore} from '../../firebase';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';




export default function TransferCaspioData() {
    const {caspioTokens, getTokens} = useAuth(); // get access tokens
    const [message, setMessage] = useState('success');
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [records, setRecords] = useState(0);
    const table = 'WO1_Work_Order_Details';
    const url = `https://c1acl820.caspio.com/rest/v2/tables/${table}/records`;
    


    async function handleGetCaspio() {
        throw new Error('erase this line if you want to transfer');
        // eslint-disable-next-line no-unreachable
        setLoading(true);
        setRecords(p=>0);
        let page = 1;
        const pageSize = 500; // minimum 5 and max 500



        while (true) {
            const query = `?q.pageNumber=${page}&q.pageSize=${pageSize}`

            console.log('start fetch')
            // get from caspio
            const response = await fetch(url+query, {
                method:'GET',
                headers: {
                    "Authorization": `Bearer ${caspioTokens?.access_token}`, // This is the important part, the auth header
                    "Content-Type": 'application/json',
                },
            });

            // check authentication
            if (response.status === 401 && caspioTokens) {
                getTokens();
                setMessage('getting tokens so rerun');
                setLoading(false);
                setPageNumber(p=>1);
                page = 1;
                return;
            }

            const data = await response.json();
            const results = data.Result;

            if (results.length === 0) {
                setMessage('success');
                setLoading(false);
                setPageNumber(p=>1);
                page = 1;
                return;
            }

            console.log('finished');
            console.log(results);
            console.log('start batch write');

            // store to firestore
            const batch = writeBatch(firestore);

            results.forEach(r => {
                const docRef = doc(firestore, table, String(r.PK_ID));
                batch.set(docRef, r);
                console.log('done')
            });
            
            // eslint-disable-next-line no-unreachable
            await batch.commit();
            console.log('finished');
            setRecords(p=>p+results.length)
            setPageNumber(p=>p+1);
            page++;
        }
    }

    return (
        <Box sx={{height:'100%', width:'100%', display:'flex', justifyContent:'center'}}>
            <Box sx={{mt:'10%'}}>
                <Button onClick={handleGetCaspio} variant='contained' disableElevation disabled={loading}>
                    Transfer
                </Button>
                <Typography>Page: {pageNumber}</Typography>
                <Typography># Records: {records}</Typography>
                <Typography>{!loading && message}</Typography>
                {loading && <CircularProgress />}
            </Box>
        </Box>
    );
}