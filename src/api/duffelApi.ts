const DUFFEL_TOKEN = ''; // Removed for security
const PROXY_BASE = '/duffel-api/air';

export async function searchFlights(
  origin: string, 
  destination: string, 
  date: string, 
  returnDate?: string,
  selectedAirlines?: string[]
) {
  const slices = [
    {
      origin: origin,
      destination: destination,
      departure_date: date
    }
  ];

  if (returnDate) {
    slices.push({
      origin: destination,
      destination: origin,
      departure_date: returnDate
    });
  }

  // 1. Create an Offer Request
  const createRequestResponse = await fetch(`${PROXY_BASE}/offer_requests`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DUFFEL_TOKEN}`,
      'Duffel-Version': 'v2'
    },
    body: JSON.stringify({
      data: {
        slices: slices,
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy',
        ...(selectedAirlines && selectedAirlines.length > 0 ? { selected_airlines: selectedAirlines } : {})
      }
    })
  });

  if (!createRequestResponse.ok) {
    const err = await createRequestResponse.text();
    console.error('Duffel Request Error:', err);
    throw new Error('Failed to create flight search request');
  }

  const requestData = await createRequestResponse.json();
  const offerRequestId = requestData.data.id;

  // 2. Fetch the offers for that request
  const offersResponse = await fetch(`${PROXY_BASE}/offers?offer_request_id=${offerRequestId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${DUFFEL_TOKEN}`,
      'Duffel-Version': 'v2'
    }
  });

  if (!offersResponse.ok) {
    throw new Error('Failed to fetch flight offers');
  }

  const offersData = await offersResponse.json();
  return offersData.data || [];
}
