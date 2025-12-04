const API_BASE = 'http://localhost:8000/api';

export const searchFlights = async (origin, destination, departureDate, returnDate = null, passengers = 1) => {
  let url = `${API_BASE}/search-flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}&adults=${passengers}`;

  if (returnDate) {
    url += `&returnDate=${returnDate}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to search flights');
  }

  return data.results;
};

export const bookFlight = async (flightOffer, travelerData) => {
  const response = await fetch(`${API_BASE}/book-amadeus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      flight_offer: flightOffer,
      traveler: travelerData
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to book flight');
  }

  return data;
};