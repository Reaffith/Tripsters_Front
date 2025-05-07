import { useEffect, useState } from "react";
import { NoTrips } from "./NoTrips/NoTrips";
import { TripsList } from "./TripsList/TripList";
import { getTrips } from "../../api";
import Loader from "../Loader/Loader";

export const TripsPage = () => {
  const [tripsCount, setTripsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getTrips().then(r => setTripsCount(r.length)).finally(() => setIsLoading(false));
  }, [])

  if (isLoading) {
    return <main className="loading">
      <Loader />
    </main>
  }

  return <main>{tripsCount > 0 ? <TripsList /> : <NoTrips />}</main>;
};
