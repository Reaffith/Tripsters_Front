import { getPlaceID } from "./getCoordinates";

async function getPlacePhotoReference(placeID: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    const request = {
      placeId: placeID,
      fields: ['photos'],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place !== null &&  place.photos && place.photos.length > 0) {
        const randomPhotoUrl = place.photos[Math.floor(Math.random() * place.photos.length)].getUrl({
          maxWidth: 400,
        });


        resolve(randomPhotoUrl);
      } else {
        reject(`Error fetching place details: ${status}`);
      }
    });
  });
}

export const getPlacePhoto = async (
  placeName: string
): Promise<string | undefined> => {
  try {
    const placeId = await getPlaceID(placeName);
    const photoUrl = await getPlacePhotoReference(placeId);

    return photoUrl;
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return;
  }
};
