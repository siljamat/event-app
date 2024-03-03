import React, {useEffect} from 'react';
import maplibregl, {Marker} from 'maplibre-gl';

const Map: React.FC = () => {
  useEffect(() => {
    const locationiq = {
      key: 'key',
    };

    // Define the map and configure the map's theme
    const map = new maplibregl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // Replace with a valid map style URL or object
      zoom: 12,
      center: [-122.42, 37.779],
    });

    // Add markers from geojson. This list can be generated dynamically with an AJAX call as well.
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            message: 'Foo',
            iconSize: [60, 60],
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.421953, 37.764966],
          },
        },
        {
          type: 'Feature',
          properties: {
            message: 'Bar',
            iconSize: [50, 50],
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.464677, 37.777209],
          },
        },
        {
          type: 'Feature',
          properties: {
            message: 'Baz',
            iconSize: [40, 40],
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.484948, 37.78009],
          },
        },
      ],
    };

    // Add markers to map
    geojson.features.forEach((marker) => {
      // create a DOM element for the marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage =
        'url(https://tiles.locationiq.com/static/images/marker50px.png)';
      el.style.width = '50px';
      el.style.height = '50px';

      // Instead of this click listener, we can attach a popup / infowindow to this marker (see next section)
      el.addEventListener('click', () => {
        window.alert(marker.properties.message);
      });

      // Convert marker.geometry.coordinates to a tuple of [number, number]
      const coordinates: [number, number] = [
        marker.geometry.coordinates[0],
        marker.geometry.coordinates[1],
      ];

      // add marker to map
      new Marker(el).setLngLat(coordinates).addTo(map);
    });

    return () => {
      map.remove(); // Cleanup when the component unmounts
    };
  }, []);

  return <div id="map" style={{height: '400px'}}></div>; // Render the map container
};

export default Map;
