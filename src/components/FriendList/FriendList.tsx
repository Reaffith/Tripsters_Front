import { useEffect, useState } from "react";
import { getAllUsers, getData, getUsersFriends } from "../../api";
import { User } from "../../types/User";

import { FriendDetails } from "./FriendDetails/FriendDetalis";
import "./FriendList.scss";
import classNames from "classnames";
import { useTranslation } from 'react-i18next';

type Friendships = {
  id: number;
  userId: number;
  friendId: number;
  status: string;
  createdAt: Date;
};

export const FriendList = () => {
  const [friendships, setFriendships] = useState<Friendships[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [currentPage, setCurrentPage] = useState<"FRIENDS" | "REQUESTS">(
    "FRIENDS"
  );
  const [friends, setFriends] = useState<Friendships[]>([]);
  const [requests, setRequests] = useState<Friendships[]>([]);
  const { t } = useTranslation();

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
    getAllUsers().then((res) => {
      if (res && typeof res !== "number") {
        setUsers(res);
      }
    });
  }, []);

  useEffect(() => {
    setFriends(
      friendships.filter((friendship) => friendship.status === "ACCEPTED")
    );
  }, [friendships]);

  useEffect(() => {
    setRequests(
      friendships.filter((friendship) => friendship.status === "PENDING")
    );
  }, [friendships]);

  return (
    <main className="friends">
      <div className="friends__top">
        <p
          className={classNames("friends__top--button", {
            active: currentPage === "FRIENDS",
          })}
          onClick={() => setCurrentPage("FRIENDS")}
        >
          {t("friends_page_friends")}
        </p>
        <p
          className={classNames("friends__top--button", {
            active: currentPage === "REQUESTS",
          })}
          onClick={() => setCurrentPage("REQUESTS")}
        >
          {t("friends_page_requests")}
        </p>
      </div>

      {currentUser && <div className="friends__list">
        {currentPage === "FRIENDS"
          ? friends.map((friend) => {
              const id =
                currentUser.id === friend.userId
                  ? friend.friendId
                  : friend.userId;

              const user = users.filter((u) => u.id === id)[0];

              return <FriendDetails user={user} key={id} isRequest={false} friendShipId={friend.id} />;
            })
          : requests.map((request) => {
              const id =
                currentUser.id === request.userId
                  ? request.friendId
                  : request.userId;

              const user = users.filter((u) => u.id === id)[0];

              return <FriendDetails user={user} key={id} isRequest={true} friendShipId={request.id} />;
            })}
      </div>}
    </main>
  );
};