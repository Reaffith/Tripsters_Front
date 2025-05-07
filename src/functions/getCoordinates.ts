export async function getCoordinates(
  place: string
): Promise<{ lat: number; lng: number }> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      place
    )}&key=AIzaSyArB1rBwI5SEnm4_5UkvO50tFUqK0bT24M`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } else {
    throw new Error("Місце не знайдено");
  }
}

export async function getPlaceID(
  place: string
): Promise<string> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      place
    )}&key=AIzaSyArB1rBwI5SEnm4_5UkvO50tFUqK0bT24M`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const placeId = data.results[0].place_id;

    return placeId;
  } else {
    throw new Error("Місце не знайдено");
  }
}