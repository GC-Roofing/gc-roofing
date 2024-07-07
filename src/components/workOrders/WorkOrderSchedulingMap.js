import {useState, useEffect, useCallback, memo, useMemo} from 'react';
import {APIProvider, Map, AdvancedMarker, useMap, useAdvancedMarkerRef, InfoWindow} from '@vis.gl/react-google-maps';


import WorkOrderScheduling from './WorkOrderScheduling';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


// this is so that the hooks are useable.
export default function WorkOrderSchedulingMap() {
    return (
        <APIProvider apiKey={'AIzaSyD_uVKlMkmGj4HIbA3cg6f4uKcv3R9pCos'}>
            <APIMap />
        </APIProvider>
    );
}

// actual contents
function APIMap() {
    // init
    const fresno = {lat: 36.7378, lng: -119.7871}; // center on fresno
    // const geocoderLibrary = useMapsLibrary('geocoding'); // library
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
    // useMemo
    const geocodes = useMemo(() => {
        console.log(data)
        return data?.map((v, i) => v.data.coordinates)||[];
    }, [data])


    // callbacks
    const updateData = useCallback((d) => setData(d), []);

    // updates
    // sets up the markers based on the data
    // useEffect(() => {
    //     if (geocoderLibrary !== null) {
    //         const geocoder = new geocoderLibrary.Geocoder();

    //         setGeocodes(prev => []);
    //         data?.slice(0,10).forEach((v, i) => {
    //             const gr = {
    //                 address: v.data().Building_Address,
    //             };

    //             console.log('bye')
    //             geocoder.geocode(gr, (results, status) => {
    //                 if (status === 'OK') {
    //                     const gs = results?.at(0).geometry.location;
    //                     setGeocodes(prev => prev.concat(gs));
    //                 } else {
    //                     console.log(status);
    //                 }
                    
    //             });
    //         });
    //     }
    // }, [data, geocoderLibrary])

    // fit the map to the markers
    useEffect(() => {
        if (map) {
            const bounds = new window.google.maps.LatLngBounds();
            console.log(geocodes)
            if (geocodes.length !== 0) {
                geocodes.forEach(marker => {
                    if (!marker) return console.log('marker is null');
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


    // handlers
    // function handleMarkerClick(event) {
    //     console.log(event)
    // }

    // function handleInfoClose() {
    //     setMarker(null);
    // }

    // function handleMarkerRef(ref) {
    //     if (marker) {
    //         markerRef.current[marker] = ref;
    //     }
    // }

    return (
        <Box sx={{height:'100%', overflow:'scroll'}}>
            {/* map */}
            <Box 
                sx={{
                    height:'75%',
                    opacity:(data) ? 1 : 0,
                    transition: 'opacity 1s ease',
                }}
                >
                <Map mapId='94b3e10296906c3b' defaultCenter={fresno} defaultZoom={10} options={mapOptions}>
                    {data?.map((v, i) => (
                        <CustomInfoMarker key={i} data={v.data} />
                    ))}
                </Map>
            </Box>
            {/* filter */}
            <Box sx={{height:'100%', overflow:'scroll'}}>
                <MemoWorkOrderScheduling updateData={updateData} />
            </Box>
        </Box>
    );
}

// memoizing the component so it doesn't update when parent updates
const MemoWorkOrderScheduling = memo(({updateData}) => <WorkOrderScheduling updateData={updateData} />);


function CustomInfoMarker({key, data}) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    function handleOpen() {
        setInfoWindowShown(true);
    }

    function handleClose() {
        setInfoWindowShown(false);
    }

    return (
        <>
            <AdvancedMarker ref={markerRef} key={key} position={data.coordinates} onClick={handleOpen} />
            {infoWindowShown &&
                <InfoWindow anchor={marker} onClose={handleClose} >
                    <Typography variant='h6'>WO# {data.WO_Number}</Typography>
                    <Typography>Lead Tech: {data.Roof_Tech_Assigned_1}</Typography>
                    <Typography>Entity: {data.Entity_Company}</Typography>
                    <Typography>Address: {data.Building_Address}, {data.Building_City}</Typography>
                </InfoWindow>
            }
        </>
    );
}



