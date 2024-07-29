import React from 'react'
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
}

const center = {
  lat: 32.93591687896567,
  lng: -96.75249843925305
};

function GoogleMapSection({address}) {
  const [directionsResponse, setDirectionsResponse] = React.useState(null);
  const [duration, setDuration] = React.useState('');
  const [distance, setDistance] = React.useState('');

  const originRef = React.useRef();
  const destinationRef = React.useRef();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })

  React.useEffect(() => {
    if (isLoaded && address) {
      calculateRoute();
    } else {
      clearRoute();
    }
  }, [isLoaded, address])

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  async function calculateRoute() {
    if(!google) {
      return;
    }

    console.log('address:', address)
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: '13729 N Central Expy, Dallas, TX 75243',
      destination: address,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    console.log('results:', results)
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
  }

  return isLoaded ? (
    <>
     <p className='font-bold pb-2'>{`Distance: ${distance}, ETA: ${duration}`}</p>
    <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={center} />
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </>
  ) : <></>
}

export default React.memo(GoogleMapSection)