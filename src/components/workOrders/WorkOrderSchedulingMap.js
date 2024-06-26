import {useState, useEffect, useCallback, memo} from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';


import WorkOrderScheduling from './WorkOrderScheduling';

import Box from '@mui/material/Box';


export default function WorkOrderSchedulingMap() {
    // init
    const position = {lat: 53.54992, lng: 10.00678};

    // state
    const [data, setData] = useState();

    // callbacks
    const updateData = useCallback((d) => setData(d), []);

    // updates
    useEffect(() => {
        async function getGeocodes() {
            const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&amp;key=AIzaSyDo0c8PILTfeDCIAfx2F7ek-FiQYepUgUU',{
                method: 'GET',
            });

            console.log(response);
            const data = await response.json();
            console.log(data)

        }

        getGeocodes();
    }, [data])

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box sx={{height:'50%'}}>
                <APIProvider apiKey={'AIzaSyD_uVKlMkmGj4HIbA3cg6f4uKcv3R9pCos'}>
                    <Map mapId='94b3e10296906c3b' defaultCenter={position} defaultZoom={10}>
                        <AdvancedMarker position={position} />
                    </Map>
                </APIProvider>
            </Box>
            <Box sx={{height:'100%', overflow:'scroll'}}>
                <MemoWorkOrderScheduling updateData={updateData} />
            </Box>
        </Box>
    );
}

// memoizing the component so it doesn't update when parent updates
const MemoWorkOrderScheduling = memo(({updateData}) => <WorkOrderScheduling updateData={updateData} />);






