/* eslint-disable no-inner-declarations */
import React, {useEffect, useContext} from 'react';
import {doGraphQLFetch} from '../src/graphql/fetch';
import {getAllEvents} from '../src/graphql/eventQueries';
import {EventType} from '../src/types/EventType';
import EventCard from '../src/components/EventCard';

declare global {
  interface Window {
    google: any;
    initMap?: () => Promise<void>;
  }
}

const Map: React.FC = () => {
  const [eventData, setEvents] = React.useState<EventType[]>([]);
  const [displayedEvents, setDisplayedEvents] = React.useState<EventType[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('fetching data');
    const fetchData = async () => {
      const data = await doGraphQLFetch(API_URL, getAllEvents, {});
      console.log('data', data);
      if (data && data.events) {
        const eventNames = new Set();
        const uniqueEvents = data.events.filter((event: EventType) => {
          if (event !== null && !eventNames.has(event.event_name)) {
            eventNames.add(event.event_name);
            return true;
          }
          return false;
        });
        setEvents(uniqueEvents);
      }
    };

    fetchData();
  }, [API_URL]);

  useEffect(() => {
    if (window.google && eventData.length > 0) {
      const {Map} = window.google.maps;

      const map = new Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 60.17, lng: 24.93},
        mapId: '4504f8b37365c3d0',
      });

      map.addListener('dragend', updateDisplayedEvents);
      map.addListener('zoom_changed', updateDisplayedEvents);
      map.addListener('idle', updateDisplayedEvents);

      function updateDisplayedEvents() {
        const bounds = map.getBounds();
        if (bounds) {
          const newDisplayedEvents = eventData.filter((event) => {
            // Check if the first coordinate is larger than the second coordinate
            const isLatLongOrder =
              event.location.coordinates[0] > event.location.coordinates[1];
            const eventPosition = new google.maps.LatLng(
              isLatLongOrder
                ? event.location.coordinates[0]
                : event.location.coordinates[1],
              isLatLongOrder
                ? event.location.coordinates[1]
                : event.location.coordinates[0],
            );
            return bounds.contains(eventPosition);
          });
          setDisplayedEvents(newDisplayedEvents);
        }
      }

      // Call updateDisplayedEvents immediately after the map is initialized
      console.log('eventData before first update', eventData);
      updateDisplayedEvents();

      // Add markers for events based on their location/coordinates
      eventData.forEach((event: EventType) => {
        // Check if the first coordinate is larger than the second coordinate
        const isLatLongOrder =
          event.location.coordinates[0] > event.location.coordinates[1];

        const marker = new window.google.maps.Marker({
          position: {
            lat: isLatLongOrder
              ? event.location.coordinates[0] + Math.random() * 0.001 - 0.0005
              : event.location.coordinates[1] + Math.random() * 0.001 - 0.0005,
            lng: isLatLongOrder
              ? event.location.coordinates[1] + Math.random() * 0.001 - 0.0005
              : event.location.coordinates[0] + Math.random() * 0.001 - 0.0005,
          },
          map,
          title: event.event_name,
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `<div>
            <div className="card w-96 bg-base-100 shadow-xl mt-5">
              <figure>
                <img src="${event.image}"></img>
              </figure>
              <div className="card-body">
                <h2 className="card-title">${event.event_name}</h2>
                <p>${event.date}</p>
                <p>${event.address}</p>
                <div className="card-actions justify-end">
                  <a className="link" href="/event/${event.id}">
                    More...
                  </a>
                </div>
              </div>
            </div>
          </div>`,
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      });

      const infoWindow = new window.google.maps.InfoWindow();

      const locationButton = document.createElement('button');
      locationButton.textContent = 'Locate';
      locationButton.style.backgroundColor = '#fff';
      locationButton.style.color = 'black';
      locationButton.style.padding = '0.5rem';
      locationButton.style.fontSize = '1rem';
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
      if (input) {
        const searchBox = new window.google.maps.places.SearchBox(input);
        map.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(
          input,
        );

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
      }
    }
  }, [eventData, window.google]);

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      return new Promise<void>((resolve) => {
        // If the API is already loaded, resolve the promise immediately
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        // Check if the script is already in the document
        if (
          document.querySelector(
            'script[src^="https://maps.googleapis.com/maps/api/js?key="]',
          )
        ) {
          const interval = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
          return;
        }

        // If the script is not in the document, create it
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_MAP_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    };

    // Call loadGoogleMapsApi inside the useEffect hook
    loadGoogleMapsApi();
  }, []);

  return (
    <div>
      <div className="search-box-container">
        <input id="pac-input" type="text" placeholder="Search for places" />
      </div>
      <div id="map" style={{width: '80%', height: '80vh'}} />
      <div>
        <>
          <div className="">
            {displayedEvents.map((event: EventType) => (
              <div className="" key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

export default Map;
