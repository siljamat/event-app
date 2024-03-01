import fetchData from './fetchData';

const getLocationCoordinates = async (address: string) => {
  const apiKey = 'pk.acfb85b0206a0b7954b5e44eb2fc915c';
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

  try {
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
