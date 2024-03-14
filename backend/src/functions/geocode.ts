import fetchData from './fetchData';

/**
 * Function for fetching location coordinates from the API.
 * @param address
 * @returns
 */
const getLocationCoordinates = async (address: string) => {
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_KEY}&q=${encodeURIComponent(address)}&format=json`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await fetchData<any>(url);
    if (response && response.length > 0) {
      return {
        lat: response[0].lat,
        lng: response[0].lon,
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    throw new Error('Error fetching coordinates');
  }
};

export {getLocationCoordinates};
