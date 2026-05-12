const RAPID_API_KEY = 'd8c5210668msh6c2a1b1a1a7546ap10faf3jsndfc60d64f4d1';
const RAPID_API_HOST = 'flights-sky.p.rapidapi.com';

const formatEntityId = (code: string) => code.toUpperCase();

export async function searchFlights(origin: string, destination: string, date: string) {
  const fromId = formatEntityId(origin);
  const toId = formatEntityId(destination);
  
  const url = `https://${RAPID_API_HOST}/web/flights/search-one-way?placeIdFrom=${fromId}&placeIdTo=${toId}&departDate=${date}&currency=USD&market=US&locale=en-US`;
  
  console.log('Fetching flights from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Error Response:', errorBody);
    throw new Error(`Flight search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API RESPONSE KEYS:', Object.keys(data).join(', '));
  if (data.data) console.log('DATA KEYS:', Object.keys(data.data).join(', '));
  
  // The API returns an object for itineraries, but we need the array inside it
  if (data.data?.itineraries) console.log('ITINERARIES KEYS:', Object.keys(data.data.itineraries).join(', '));
  
  const results = data.data?.itineraries?.results || data.data?.itineraries || [];
  console.log('FINAL RESULTS COUNT:', Array.isArray(results) ? results.length : 'NOT AN ARRAY');
  
  return Array.isArray(results) ? results : [];
}
