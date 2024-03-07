import React, {useEffect} from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const Map: React.FC = () => {
  useEffect(() => {
    const loadGoogleMapsApi = () => {
      return new Promise<void>((resolve) => {
        // Add 'void' as the type argument
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAP_API_KEY}&libraries=places`;
        script.async = true;
        document.body.appendChild(script);

        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    };

    const initMap = async () => {
      await loadGoogleMapsApi();

      const {Map, InfoWindow} = window.google.maps;

      const map = new Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 60.17, lng: 24.93},
        mapId: '4504f8b37365c3d0',
      });

      const infoWindow = new InfoWindow();

      const locationButton = document.createElement('button');
      locationButton.textContent = 'Locate';
      locationButton.style.backgroundColor = '#fff'; // bg-white
      locationButton.style.color = 'black'; // text-black
      locationButton.style.padding = '0.5rem 1rem'; // px-4 py-2
      locationButton.style.borderRadius = '0.25rem'; // rounded
      locationButton.style.fontSize = '1rem'; // text-base
      locationButton.style.cursor = 'pointer';
      locationButton.className = 'custom-map-control-button';
      map.controls[window.google.maps.ControlPosition.BOTTOM_CENTER].push(
        locationButton,
      );

      locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              infoWindow.setPosition(pos);
              infoWindow.setContent('Location found.');
              infoWindow.open(map);
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            },
          );
        } else {
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });

      const handleLocationError = (
        browserHasGeolocation: boolean,
        infoWindow: any,
        pos: {lat: number; lng: number},
      ) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : "Error: Your browser doesn't support geolocation.",
        );
        infoWindow.open(map);
      };

      const input = document.getElementById('pac-input');
      const searchBox = new window.google.maps.places.SearchBox(input);

      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);

      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      let markers: google.maps.Marker[] = [];

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        const bounds = new window.google.maps.LatLngBounds();

        places.forEach((place: google.maps.places.PlaceResult) => {
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }

          const icon = {
            url: place.icon,
            size: new window.google.maps.Size(71, 71),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(17, 34),
            scaledSize: new window.google.maps.Size(25, 25),
          };

          markers.push(
            new window.google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            }),
          );

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });

      //TODO: bring event from db
      const tourStops = [
        {position: {lat: 60.1512, lng: 24.9173}, title: 'Boynton Pass'},
        // Add more tour stops here...
      ];

      tourStops.forEach(({position, title}, i) => {
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: `${i + 1}. ${title}`,
        });

        marker.addListener('click', () => {
          infoWindow.close();
          infoWindow.setContent(marker.title);
          infoWindow.open(map, marker);
        });
      });
    };

    initMap();
  }, []);

  return (
    <div>
      <input
        id="pac-input"
        className="controls text-lg py-2"
        type="text"
        placeholder="Search Box"
      />
      <div id="map" style={{width: '80%', height: '80vh'}} />
    </div>
  );
};

export default Map;
