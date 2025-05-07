import { useParams } from "react-router-dom";
import "./ProfilePage.scss";
import { useEffect, useState } from "react";
import { User } from "../../types/User";
import { getAllUsers, getData } from "../../api";
import noPfp from "../../pics/no-pfp.png";
import { MemberDetails } from "../TripDetails/MemberDetails/MemberDetails";
import { Trip } from "../../types/Trip";
import { TripInfo } from "../TripsPage/TripsList/TripInfo/TripInfo";
import Loader from "../Loader/Loader";
import { useTranslation } from "react-i18next";

type Friendship = {
  id: number;
  userId: number;
  friendId: number;
  status: string;
  createdAt: Date;
};

export const ProfilePage = () => {
  const { id } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [disableButton, setDisableButton] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();


  useEffect(() => {
    getData(`trip/user/${id}`).then((response) => setTrips(response));
  }, [id]);

  useEffect(() => {
    const getFriendships = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(`https://tripsters.up.railway.app/friends`, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.log(response.status);
          return response.status;
        }

        const data: Friendship[] = await response.json();

        return data;
      } catch (error) {
        console.log(error);
      }
    };

    getFriendships().then((res) => {
      if (res && typeof res !== "number") {
        setFriendRequests(res);
      }
    });
  }, [user, id]);

  useEffect(() => {
    getData("users/current").then(setCurrentUser);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    getAllUsers()
      .then((response) => {
        if (response && typeof response !== "number") {
          setUsers(response);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setUser(users.filter((u) => u.id === Number(id))[0]);
  }, [users, id]);


  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const [userPfp, setUserPfp] = useState<Blob>();

  useEffect(() => {
    const getPhoto = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(
          `https://tripsters.up.railway.app/uploads/images/${user?.fileUrl}`, {
            method: "GET",
            mode: "cors",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch photo: ${response.statusText}`);
        }

        return await response.blob();
      } catch (error) {
        console.error("Error fetching photo:", error);
        throw error;
      }
    };

    if (user) {
      getPhoto().then(response => {
        setUserPfp(response);
        console.log(response);
      })
    }
  }, [user, id]);

  const postPhoto = async () => {
    console.log(file);
    const token = localStorage.getItem("authToken");

    if (file !== null) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://tripsters.up.railway.app/uploads/images", {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        console.log(response);

        return response.text();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const createFriendship = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://tripsters.up.railway.app/friends", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          friendId: user?.id,
        }),
      });

      if (!response.ok) {
        console.error(`Error: ${response.status}`);
        throw new Error(`Failed to create friendship: ${response.status}`);
      }

      console.log(response.status);

      const responseBody = await response.json();

      setDisableButton(true);

      return responseBody;
    } catch (error) {
      console.error("Error while creating friendship:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (
      friendRequests.filter(
        (req) =>
          (req.friendId === currentUser?.id && req.userId === user?.id) ||
          (req.friendId === user?.id && req.userId === currentUser?.id)
      ).length > 0
    ) {
      setDisableButton(true);
    }
  }, [friendRequests, currentUser, user]);

  useEffect(() => {
    setFriends(
      friendRequests
        .filter((req) => req.status === "ACCEPTED")
        .filter((req) => req.friendId === user?.id || req.userId === user?.id)
    );
  }, [friendRequests, user, id]);

  useEffect(() => {
    if (file !== null) {
      postPhoto();
    }
  }, [file]);

  if (isLoading) {
    return <main className="loading">
      <Loader />
    </main>
  }


  return (
    <>
  {user && (
    <main className="profile">
      <div className="profile__top">
        <div className="profile-box">
          <img src={userPfp ? URL.createObjectURL(userPfp) : noPfp} alt={t("profile_page_pfp_alt")} className="profile__top--pic" />

          <label htmlFor="file-upload" className="profile-box--label">
            {t("profile_page_change_picture")}
          </label>

          <input
            className="profile__top--button"
            type="file"
            id="file-upload"
            onChange={(e) => handleFileChange(e)}
            accept=".jpg, .jpeg"
          />
        </div>

        <div className="profile__top--info">
          <h1 className="profile__top--info--name">
            {`${user.firstName} ${user.lastName}`}
          </h1>

          <p className="profile__top--info--stat">{`${friends.length} ${t("profile_page_friends")}`}</p>

          <p className="profile__top--info--stat">{`${trips.length} ${t("profile_page_trips")}`}</p>
        </div>

        {currentUser ? (
          currentUser.id === user.id ? (
            <div>{` `}</div>
          ) : (
            <button
              className="profile__top--button"
              disabled={disableButton}
              onClick={createFriendship}
            >
              {disableButton
                ? t("profile_page_friend_request_sent")
                : t("profile_page_send_friend_request")}
            </button>
          )
        ) : (
          <div>{` `}</div>
        )}
      </div>

      <h1 className="profile__header">{t("profile_page_friends_header")}</h1>

      <div className="profile__friendlist">
        {friends.length > 0 ? (
          <div className="profile__friendlist--list">
            {friends
              .slice(0, friends.length > 9 ? 8 : 9)
              .map((friendship) => {
                const friendId =
                  friendship.userId === user.id
                    ? friendship.friendId
                    : friendship.userId;

                const friend = users.filter((u) => u.id === friendId)[0];

                return <MemberDetails user={friend} key={friend.id} />;
              })}

            {friends.length > 9 && (
              <div className="profile__friendlist--list--more">
                <p className="profile__friendlist--list--more--text">{`${
                  friends.length - 8
                } ${t("profile_page_more")}`}</p>
              </div>
            )}
          </div>
        ) : (
          <h2>{t("profile_page_user_friend_list_empty")}</h2>
        )}
      </div>

      <h1 className="profile__header">{t("profile_page_trips_header")}</h1>

      <div className="profile__trips">
        {trips.length > 0 ? (
          <div className="profile__trips--list">
            {trips.slice(0, 3).map((trip) => (
              <TripInfo trip={trip} ableToSee = {false} key={trip.id} />
            ))}

            {trips.length > 3 && (
              <h2 className="profile__trips--list--additional">{`${
                trips.length - 3
              } ${t("profile_page_more_trips")}`}</h2>
            )}
          </div>
        ) : (
          <h2>{t("profile_page_user_trip_list_empty")}</h2>
        )}
      </div>
    </main>
  )}
</>
  );
};
