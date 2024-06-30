import { writeBatch, doc, getDocs, collection } from "firebase/firestore"; 
import {useState} from 'react';
import {APIProvider, useMapsLibrary} from '@vis.gl/react-google-maps';


import {firestore} from '../../firebase';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


// this is so that the hooks are useable.
export default function BatchUpdates() {
    return (
        <APIProvider apiKey={'AIzaSyD_uVKlMkmGj4HIbA3cg6f4uKcv3R9pCos'}>
            <APIBatchUpdates />
        </APIProvider>
    );
}


function APIBatchUpdates() {
    const [loading, setLoading] = useState(false);
    const [batchNum, setBatchNum] = useState(1);
    const [records, setRecords] = useState(0);
    const geocoderLibrary = useMapsLibrary('geocoding'); // library
    const collectionName = 'WO1_Work_Order_Details';
    const key = 'coordinates';
    const value = async (r) => {
        const geocoder = new geocoderLibrary.Geocoder();
        let gs = null;

        const gr = {
            address: r.Building_Address + ', ' + r.Building_City,
        };

        try {
            await geocoder.geocode(gr, (results, status) => {
                if (status === 'OK') {
                    gs = results?.at(0).geometry.location;
                } else {
                    console.log(status);
                    console.log(r.Building_Address)
                }
                
            });
        } catch (e) {console.log(e)};

        return gs;
    };


    async function handleGet() {
        throw new Error('erase this line if you want to update');
        // eslint-disable-next-line no-unreachable
        setLoading(true);
        setRecords(p=>0);
        setBatchNum(p=>0);



        console.log('get docs');
        const querySnapshot = await getDocs(collection(firestore, collectionName));

        console.log('finished');
        console.log(querySnapshot.docs);
        console.log('start batch write');

        // store to firestore
        let batch = writeBatch(firestore);
        let writeNum = 0;

        for (let r of querySnapshot.docs) {
            const docRef = doc(firestore, collectionName, r.id);

            console.log('update')
            const v = await value(r.data());
            const updateValue = {[key]: {
                lat: v && v.lat(),
                lng: v && v.lng(),
            }};
            batch.update(docRef, updateValue);

            console.log('done')
            writeNum++;
            if (writeNum === 500) {
                console.log('start batch');
                await batch.commit();
                console.log('finished one batch');
                batch = writeBatch(firestore);
                setRecords(p=>p+500)
                setBatchNum(p=>p+1);
                writeNum = 0;
            }
        }

        // querySnapshot.forEach(async r => {
        //     const docRef = doc(firestore, collectionName, r.id);
        //     console.log('update')
        //     const v = await value(r.data());
        //     const updateValue = {[key]: {
        //         lat: v && v.lat(),
        //         lng: v && v.lng(),
        //     }};
        //     batch.update(docRef, updateValue);
        //     console.log('done')
        //     writeNum++;
        //     if (writeNum === 500) {
        //         await batch.commit();
        //         console.log('finished one batch')
        //         batch = writeBatch(firestore);
        //         setRecords(p=>p+500)
        //         setBatchNum(p=>p+1);
        //         writeNum = 0;
        //     }
        // });
        
        setRecords(p=>p+writeNum);
        setBatchNum(p=>p+1);
        setLoading(false);

            
    }

    return (
        <Box sx={{height:'100%', width:'100%', display:'flex', justifyContent:'center'}}>
            <Box sx={{mt:'10%'}}>
                <Button onClick={handleGet} variant='contained' disableElevation disabled={loading}>
                    update
                </Button>
                <Typography>Page: {batchNum}</Typography>
                <Typography># Records: {records}</Typography>
                <Typography>{!loading && 'success'}</Typography>
                {loading && <CircularProgress />}
            </Box>
        </Box>
    );
}