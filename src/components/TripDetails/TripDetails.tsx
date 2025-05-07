import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import "./TripDetails.scss";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Trip } from "../../types/Trip";
import {
  getAllUsers,
  getAllusersInTrip,
  getData,
  getTrips,
  getUsersFriends,
} from "../../api";
import { DateToString, stringToDate } from "../../functions/dateManager";
import { User } from "../../types/User";
import { AddUserInfo } from "./AddUserInfo/AddUserInfo";
import { MemberDetails } from "./MemberDetails/MemberDetails";

export const TripDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isMapVisible, changeIsMapVisible] = useState(false);
  const [isChatVisible, changeIsChatVisible] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trip, setTrip] = useState<Trip>();
  const [users, setUsers] = useState<User[]>([]);
  const [friendships, setFriendships] = useState<
    {
      id: number;
      userId: number;
      friendId: number;
      status: string;
      createdAt: Date;
    }[]
  >([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [owner, setOwner] = useState<User>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    changeIsMapVisible(location.pathname.includes('/map'));
    changeIsChatVisible(location.pathname.includes('/chat'));
  }, [location]);

  useEffect(() => {
    const getOwner = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          `https://tripsters.up.railway.app/trip/owner/${trip?.id}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: User = await response.json();

        return data;
      } catch (error) {
        console.log(error);
      }
    };

    if (trip) {
      getOwner().then((data) => setOwner(data));
    }
  }, [trip]);

  useEffect(() => {
    getAllUsers().then((res) => {
      if (res && typeof res !== "number") {
        setAllUsers(res);
      }
    });
  }, []);

  useEffect(() => {
    getUsersFriends().then((res) => {
      if (res && typeof res !== "number") {
        setFriendships(res);
      }
    });
  }, []);

  useEffect(() => {
    getData("users/current").then(setCurrentUser);
  }, []);

  useEffect(() => {
    const neededFriendships = friendships.filter(
      (friendship) =>
        friendship.status === "ACCEPTED" &&
        (friendship.userId === currentUser?.id ||
          friendship.friendId === currentUser?.id)
    );

    const friends: User[] = [];

    for (let i = 0; i < neededFriendships.length; i++) {
      const friend = allUsers.filter(
        (u) =>
          u.id !== currentUser?.id &&
          (u.id === neededFriendships[i].userId ||
            u.id === neededFriendships[i].friendId)
      )[0];

      friends.push(friend);
    }

    setFriends(friends);
  }, [friendships, currentUser, allUsers, users]);

  useEffect(() => {
    getTrips().then((data) => {
      if (data) {
        setTrips(data);
      } else {
        console.error("No trips loaded");
      }
    });
  }, []);

  useEffect(() => {
    setTrip(trips.filter((t) => t.id === Number(id))[0]);
  }, [id, trips]);

  const [updateUsers, setUpdateUsers] = useState(1);

  useEffect(() => {
    if (id) {
      getAllusersInTrip(id).then((data) => setUsers(data));
    }
  }, [updateUsers, id]);

  const showMap = () => {
    navigate(`/tripDetails/${trip?.id}/map`);
  };

  const showChat = () => {
    navigate(`/tripDetails/${trip?.id}/chat`);
  };

  const getNavItemStyle = (isVisible: boolean) => {
    if (isVisible) {
      return { color: "#309C4D" };
    } else {
      return { color: "#757575" };
    }
  };

  const [status, setStatus] = useState<"Incoming" | "In progres" | "Completed">(
    "Incoming"
  );

  useEffect(() => {
    const date = new Date();

    if (trip) {
      if (stringToDate(trip.startDate) > date) {
        setStatus("Incoming");
      } else if (stringToDate(trip.endDate) < date) {
        setStatus("Completed");
      } else {
        setStatus("In progres");
      }
    }
  }, [trip]);

  const [isAdd, setIsAdd] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "In progres":
        return "#309C4D";

      case "Completed":
        return "#9C304E";

      default:
        return "#8C8C8C";
    }
  };

  useEffect(() => {
    if (isAdd) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAdd]);

  return (
    <>
      {isAdd && (
        <div className="add" onClick={() => setIsAdd(false)}>
          <div className="add__block" onClick={(e) => e.stopPropagation()}>
            <p className="add__block--header">{t("trip_details_add_user_header")}</p>

            <div className="add__block--users">
              {friends.map((friend) => (
                <AddUserInfo
                  key={friend.id}
                  user={friend}
                  tripId={trip?.id}
                  alreadyInTrip={
                    !!users.filter((u) => u.id === friend.id).length
                  }
                  setUpdateUsers={setUpdateUsers}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <main className="trip-details">
        <div className="trip-details__block1">
          <h2 className="trip-details__block1--header">{trip?.destination}</h2>

          <div className="trip-details__block1--route">
            <h3 className="trip-details__block1--route--item">
              {t("trip_details_from")} : {trip?.startPoint}
            </h3>

            <h3 className="trip-details__block1--route--item">
              {trip?.additionalPoints.length} {t("trip_details_additional_points")}
            </h3>

            <h3 className="trip-details__block1--route--item">
              {t("trip_details_to")} : {trip?.endPoint}
            </h3>
          </div>

          <div className="trip-details__block1--members">
            <h3 className="trip-details__block1--members--header">
              {users.length} {t("trip_details_members")}
            </h3>
            <div className="trip-details__block1--members--block">
              {users.map((u) => (
                <MemberDetails user={u} key={u.id} />
              ))}
            </div>
          </div>

          <div className="trip-details__block1--date">
            <h3 className="trip-details__block1--date--item">
              {t("trip_details_start_on")} : {trip && DateToString(stringToDate(trip.startDate))}
            </h3>
            <h3 className="trip-details__block1--date--item">
              {t("trip_details_finish_on")} : {trip && DateToString(stringToDate(trip.endDate))}
            </h3>
          </div>

          <button
            className="trip-details__block1--button"
            onClick={() => navigate(`../../trips/edit/${id}`)}
          >
            {t("trip_details_edit_trip_button")}
          </button>
        </div>

        <div className="trip-details__block2">
          <div className="trip-details__block2--info">
            <div className="trip-details__block2--info--left">
              <h1 className="trip-details__block2--info--left--header">
                {trip?.destination}
              </h1>

              <div className="trip-details__block2--info--left--status">
                <div
                  className="trip-details__block2--info--left--status--circle"
                  style={{ backgroundColor: getStatusColor() }}
                ></div>

                {status}
              </div>
            </div>

            {owner?.id === currentUser?.id && (
              <button
                className="trip-details__block2--info--add"
                onClick={() => setIsAdd(true)}
              >
                {t("trip_details_add_user_into_trip_button")}
              </button>
            )}
          </div>

          <div className="trip-details__block2--nav">
            <p
              className="trip-details__block2--nav--item"
              onClick={showMap}
              style={getNavItemStyle(isMapVisible)}
            >
              {t("trip_details_map_nav_item")}
            </p>

            <p
              className="trip-details__block2--nav--item"
              onClick={showChat}
              style={getNavItemStyle(isChatVisible)}
            >
              {t("trip_details_chat_nav_item")}
            </p>
          </div>

          <div className="trip-details__block2--content">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};