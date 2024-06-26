import {useState, useEffect, useCallback, memo} from 'react';
import {APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap} from '@vis.gl/react-google-maps';


import WorkOrderScheduling from './WorkOrderScheduling';

import Box from '@mui/material/Box';


export default function WorkOrderSchedulingMap() {
    return (
        <APIProvider apiKey={'AIzaSyD_uVKlMkmGj4HIbA3cg6f4uKcv3R9pCos'}>
            <APIMap />
        </APIProvider>
    );
}

function APIMap() {
    // init
    const fresno = {lat: 36.7378, lng: -119.7871}; // center on fresno
    const geocoderLibrary = useMapsLibrary('geocoding'); // library
    const map = useMap();
    const mapOptions = {
        disableDefaultUI: true,
        scrollwheel: false,
        gestureHandling: 'cooperative', // Users can scroll normally, but must hold Ctrl to zoom the map
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl:false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            mapTypeIds: [window.google?.maps?.MapTypeId?.ROADMAP, window.google?.maps?.MapTypeId?.HYBRID],
        },
    };

    

    // state
    const [data, setData] = useState(); // data to get from query
    const [geocodes, setGeocodes] = useState([]); // for setting the geocodes

    // callbacks
    const updateData = useCallback((d) => setData(d), []);

    // updates
    // sets up the markers based on the data
    useEffect(() => {
        if (geocoderLibrary !== null) {
            const geocoder = new geocoderLibrary.Geocoder();

            setGeocodes(prev => []);
            data?.slice(0,10).forEach((v, i) => {
                const gr = {
                    address: v.Building_Address,
                };

                console.log('bye')
                geocoder.geocode(gr, (results, status) => {
                    if (status === 'OK') {
                        const gs = results?.at(0).geometry.location;
                        setGeocodes(prev => prev.concat(gs));
                    } else {
                        console.log(status);
                    }
                    
                });
            });
        }
    }, [data, geocoderLibrary])

    // fit the map to the markers
    useEffect(() => {
        if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            console.log(geocodes)
            if (geocodes.length !== 0) {
                geocodes.forEach(marker => {
                    bounds.extend(marker);
                });

                map.fitBounds(bounds);
            } else {
                const center = {lat: 36.7378, lng: -119.7871}
                map.setCenter(center);
                map.setZoom(10);
            }
        }
    }, [map, geocodes]);

    // update map type because statically it didn't work
    useEffect(() => {
        if (map) {
            map.setMapTypeId('hybrid');
        }
    }, [map])

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            <Box 
                sx={{
                    height:'75%',
                    opacity:(data) ? 1 : 0,
                    transition: 'opacity 1s ease',
                }}
                >
                <Map mapId='94b3e10296906c3b' defaultCenter={fresno} defaultZoom={10} options={mapOptions}>
                    {geocodes.map((v, i) => (
                        <AdvancedMarker key={i} position={v} />
                    ))}
                </Map>
            </Box>
            <Box sx={{height:'100%', overflow:'scroll'}}>
                <MemoWorkOrderScheduling updateData={updateData} />
            </Box>
        </Box>
    );
}

// memoizing the component so it doesn't update when parent updates
const MemoWorkOrderScheduling = memo(({updateData}) => <WorkOrderScheduling updateData={updateData} />);






