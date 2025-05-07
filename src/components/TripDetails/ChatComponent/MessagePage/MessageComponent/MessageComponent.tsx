import { useEffect, useState } from "react";
import { User } from "../../../../../types/User";
import "./MessageComponent.scss";
import { getAllusersInTrip, getData } from "../../../../../api";
import classNames from "classnames";
import noPfp from "../../../../../pics/no-pfp.png";

type Message = {
  id: number;
  timestamp: string;
  userId: number;
  tripId: number;
  message: string;
};

type Params = {
  message: Message;
};

export const MessageComponent: React.FC<Params> = ({ message }) => {
  const [currentUser, setCurrentUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [author, setAuthor] = useState<User>();
  
  const [userPfp, setUserPfp] = useState<Blob>();

  useEffect(() => {
    const getPhoto = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch(
          `https://tripsters.up.railway.app/uploads/images/${author?.fileUrl}`, {
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

    if (author) {
      getPhoto().then(response => {
        setUserPfp(response);
        console.log(response);
      })
    }
  }, [author]);


  const transformDate = () => {
    const date = message.timestamp;
    const dateArr = [...date];

    const dateTime = [dateArr[11], dateArr[12], dateArr[13],  dateArr[14], dateArr[15],].join('');

    return dateTime;
  }

  useEffect(() => {
    getAllusersInTrip(message.tripId.toString()).then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    setAuthor(users.filter((u) => u.id === message.userId)[0]);
  }, [users]);

  useEffect(() => {
    getData("users/current").then(setCurrentUser);
  }, []);

  return (
    <div
      key={message.id}
      className={classNames("message", {
        "current-user": message.userId === currentUser?.id,
      })}
    >
      {author?.id !== currentUser?.id && (
        <img src={userPfp ? URL.createObjectURL(userPfp) : noPfp} alt="PFP" className="message__pfp" />
      )}

      <div className="message__block">
        {author?.id !== currentUser?.id && (
          <p className="message__block--author">{author?.firstName}</p>
        )}

        <p className="message__block--message">{message.message}</p>

        <p className="message__block--time">
          {transformDate()}
        </p>
      </div>

      {author?.id === currentUser?.id && (
        <img src={userPfp ? URL.createObjectURL(userPfp) : noPfp} alt="PFP" className="message__pfp" />
      )}
    </div>
  );
};
