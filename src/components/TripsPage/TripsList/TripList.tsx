import { TripInfo } from "./TripInfo/TripInfo";
import "./TripList.scss";
import { Trip } from "../../../types/Trip";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { stringToDate } from "../../../functions/dateManager";
import { getNumbers } from "../../../functions/getNumbers";
import classNames from "classnames";
import { getTrips } from "../../../api";
import Loader from "../../Loader/Loader";
import { useTranslation } from 'react-i18next';

type FilterOptions = "ALL" | "COMPLETED" | "INCOMING" | "IN PROGRESS";

export const TripsList = () => {
  const [filter, setFilter] = useState<FilterOptions>("ALL");
  const [isDropDown, setIsDropDown] = useState(false);
  const [paging, setPaging] = useState<number[]>([]);
  const [page, setPage] = useState<number>(1);
  const [tripsToRender, setTripsToRender] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const showDropDown = () => {
    setIsDropDown(true);
  };

  const hideDropDown = () => {
    setIsDropDown(false);
  };

  const tripFilter = (trip: Trip) => {
    const today = new Date();

    switch (filter) {
      case "COMPLETED": {
        if (stringToDate(trip.endDate) <= today) {
          return true;
        } else {
          return false;
        }
      }

      case "INCOMING": {
        if (stringToDate(trip.startDate) >= today) {
          return true;
        } else {
          return false;
        }
      }

      case "IN PROGRESS": {
        if (
          stringToDate(trip.startDate) <= today &&
          stringToDate(trip.endDate) >= today
        ) {
          return true;
        } else {
          return false;
        }
      }

      default: {
        return true;
      }
    }
  };

  const getTripsToRender = (trips: Trip[]) => {
    const filteredTrips = trips
      .filter((trip) => tripFilter(trip))
      .sort((a, b) => {
        return (
          stringToDate(b.startDate).getTime() -
          stringToDate(a.startDate).getTime()
        );
      });

    if (filteredTrips.length > 5) {
      const numOfPages = Math.ceil(filteredTrips.length / 5);
      setPaging(getNumbers(numOfPages));

      const render = [];

      for (let i = 0; i < 5; i++) {
        if (page === 1) {
          if (filteredTrips[i]) {
            render.push(filteredTrips[i]);
          }
        } else {
          if (filteredTrips[i + (page - 1) * 5]) {
            render.push(filteredTrips[i + (page - 1) * 5]);
          }
        }
      }

      setTripsToRender(render);
    } else {
      setTripsToRender(filteredTrips);
      setPaging([]);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const trips = await getTrips();

        return getTripsToRender(trips);
      } catch (error) {
        console.log(error);
      }
    };

    setIsLoading(true);
    fetchTrips().finally(() => setIsLoading(false));
  }, [page, filter]);

  if (isLoading) {
    return (
      <main className="loading">
        <Loader />
      </main>
    );
  }

  return (
    <main className="triplist">
      <h1 className="triplist__header">{t("trips_list_header")}</h1>

      <div
        className="triplist__filter"
        tabIndex={0}
        onClick={showDropDown}
        onBlur={hideDropDown}
      >
        <div className="triplist__filter--block">
          <p className="triplist__filter--block--current">
            {filter === "ALL" ? t("trips_list_filter_all") : t(`trips_list_filter_${filter.toLowerCase().replace(' ', '_')}`)}
          </p>

          <div className="triplist__filter--block--dropdown">
            <IoMdArrowDropdown />
          </div>
        </div>

        <div
          className="triplist__filter--options"
          style={
            isDropDown
              ? { opacity: "1", pointerEvents: "all" }
              : { opacity: "0", pointerEvents: "none" }
          }
        >
          <p
            className="triplist__filter--options--item"
            onClick={() => {
              setFilter("ALL");
              hideDropDown();
            }}
          >
            {t("trips_list_filter_all")}
          </p>

          <p
            className="triplist__filter--options--item"
            onClick={() => {
              setFilter("INCOMING");
              hideDropDown();
            }}
          >
            {t("trips_list_filter_incoming")}
          </p>

          <p
            className="triplist__filter--options--item"
            onClick={() => {
              setFilter("IN PROGRESS");
              hideDropDown();
            }}
          >
            {t("trips_list_filter_in_progress")}
          </p>

          <p
            className="triplist__filter--options--item"
            onClick={() => {
              setFilter("COMPLETED");
              hideDropDown();
            }}
          >
            {t("trips_list_filter_completed")}
          </p>
        </div>
      </div>

      <div className="triplist__list">
        {tripsToRender.map((trip) => {
          return <TripInfo trip={trip} key={trip.id} />;
        })}

        {paging.length > 1 && (
          <div className="triplist__list--paging">
            {paging.map((pa) => (
              <p
                key={pa}
                onClick={() => setPage(pa)}
                className={classNames("triplist__list--paging--item", {
                  active: page === pa,
                })}
              >
                {pa}
              </p>
            ))}
          </div>
        )}
      </div>

      <Link to={"create"} className="triplist__button">
        {t("trips_list_create_trip_button")}
      </Link>
    </main>
  );
};