import { useState, useEffect } from "react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

import "./mapComponent.scss";
import { getCoordinates } from "../../../functions/getCoordinates";
import PlacesAutocomplete from "react-places-autocomplete";
import { useParams } from "react-router-dom";
import { Trip } from "../../../types/Trip";
import { getTrips } from "../../../api";

function getRouteCenter(route: { lat: number; lng: number }[]) {
  const total = route.length;

  const sumCoords = route.reduce(
    (acc, coord) => {
      return {
        lat: acc.lat + coord.lat,
        lng: acc.lng + coord.lng,
      };
    },
    { lat: 0, lng: 0 }
  );

  return {
    lat: sumCoords.lat / total,
    lng: sumCoords.lng / total,
  };
}

export const MapComponent = () => {
  const [trip, setTrip] = useState<Trip>();
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    getTrips().then((response) =>
      setTrip(response.filter((t: Trip) => (id ? t.id === +id : 0))[0])
    );
  }, [id]);

  const [startPoint, setStartPoint] = useState("");
  const [finishPoint, setFinishPoint] = useState("");
  const [additionalPoints, setAdditionalPoints] = useState<string[]>([]);

  useEffect(() => {
    if (trip) {
      setStartPoint(trip.startPoint);
      setFinishPoint(trip.endPoint);
      setAdditionalPoints(trip.additionalPoints);
    }
  }, [trip]);

  const [startPointCoordinates, setStartPointCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [finishPointCoordinates, setFinishPointCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [additionalPointsCoordinates, setAdditionalPointsCoordinates] =
    useState<{ lat: number; lng: number }[]>([]);

  const [centerCoordinates, setCenterCoordinates] = useState<{
    lat: number;
    lng: number;
  }>();

  const [suggest, setSuggest] = useState("");

  useEffect(() => {
    if (startPoint && finishPoint) {
      getCoordinates(startPoint)
        .then((coords) => setStartPointCoordinates(coords))
        .catch((e) => console.log(e));

      getCoordinates(finishPoint)
        .then((coords) => setFinishPointCoordinates(coords))
        .catch((e) => console.log(e));
    }
  }, [startPoint, finishPoint, trip]);

  useEffect(() => {
    const fetchAdditionalCoordinates = async () => {
      const coordinates = await Promise.all(
        additionalPoints.map((point) =>
          getCoordinates(point).catch((e) => {
            console.log(e);
            return null;
          })
        )
      );

      setAdditionalPointsCoordinates(
        coordinates.filter((coord) => coord !== null)
      );
    };

    if (additionalPoints) {
      fetchAdditionalCoordinates();
    }
  }, [additionalPoints, trip]);

  useEffect(() => {
    setCenterCoordinates(
      getRouteCenter([
        startPointCoordinates,
        ...additionalPointsCoordinates,
        finishPointCoordinates,
      ])
    );
  }, [
    startPointCoordinates,
    finishPointCoordinates,
    additionalPointsCoordinates,
  ]);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: startPointCoordinates,
        destination: finishPointCoordinates,
        waypoints: additionalPointsCoordinates.map((coords) => ({
          location: coords,
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          setDirections(response);
        }
      }
    );
  }, [
    additionalPointsCoordinates,
    startPointCoordinates,
    finishPointCoordinates,
  ]);

  const sendSuggest = async () => {
    const token = localStorage.getItem("authToken");

    const tripId = id ? +id : 0;

    const vote = {
      tripId: tripId,
      title: suggest,
      voteOptions: ["Yes", "No"],
    };

    try {
      const response = await fetch("https://tripsters.up.railway.app/votes", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vote),
      });

      if (!response.ok) {
        throw new Error(`Failed to create trip: ${response.status}`);
      } else {
        setSuggest("");
      }

      const responseBody = await response.json();

      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="map">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerCoordinates}
          zoom={5}
          options={{ streetViewControl: false }}
        >
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="suggest">
        <label className="suggest--header">
          {t("map_component_suggest_header")}
        </label>

        <PlacesAutocomplete
          value={suggest}
          onChange={setSuggest}
          onSelect={(v) => setSuggest(v)}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="suggest-block">
              <div>
                <input
                  id="suggestion"
                  {...getInputProps({
                    placeholder: t("map_component_suggest_input_placeholder"),
                  })}
                />
                <div
                  className="suggestions"
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  {loading ? (
                    <div>{t("map_component_suggest_loading")}</div>
                  ) : null}

                  {suggestions.map((suggestion) => {
                    const style = suggestion.active
                      ? {
                          width: "100%",
                          backgroundColor: "#ECF9EF",
                          cursor: "pointer",
                          padding: "8px 12px",
                          borderRadius: "20px",
                        }
                      : {
                          width: "100%",
                          cursor: "pointer",
                          padding: "8px 12px",
                          backgroundColor: "white",
                        };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, { style })}
                        key={suggestion.placeId}
                      >
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button className="suggest-block--button" onClick={sendSuggest}>
                {t("map_component_suggest_submit_button")}
              </button>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    </>
  );
};
