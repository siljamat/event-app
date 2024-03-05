import React, {useEffect} from 'react';
import maplibregl, {Marker} from 'maplibre-gl';

const Map: React.FC = () => {
  useEffect(() => {
    const locationiq = {
      key: 'key',
    };

    const map = new maplibregl.Map({
      container: 'map',
      style:
        'https://tiles.locationiq.com/v3/streets/vector.json?key=' +
        locationiq.key,
      zoom: 10,
      center: [24.93, 60.17],
    });

    map.on('load', () => {
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
              coordinates: [24.9173, 60.1512],
            },
          },
        ],
      };

      geojson.features.forEach((marker) => {
        const coordinates = marker.geometry.coordinates;

        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage =
          'url(https://tiles.locationiq.com/static/images/marker50px.png)';
        el.style.width = '50px';
        el.style.height = '50px';

        el.addEventListener('click', () => {
          window.alert(marker.properties.message);
        });

        new Marker(el).setLngLat([coordinates[0], coordinates[1]]).addTo(map);
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" style={{width: '500px', height: '500px', margin: 'auto'}} />
  );
};

export default Map;