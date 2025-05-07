import { useEffect, useState } from "react";
import { User } from "../../../types/User";
import "./FriendDetails.scss";
import noPfp from "../../../pics/no-pfp.png";
import { useNavigate } from "react-router-dom";
import { getPhoto, putData } from "../../../api";
import { useTranslation } from 'react-i18next';

type Props = {
  user: User | undefined;
  isRequest: boolean;
  friendShipId: number;
};

export const FriendDetails: React.FC<Props> = ({ user, isRequest, friendShipId }) => {
  const [imgSrc, setImgSrc] = useState<Blob>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
      if (user) {
        getPhoto(user.fileUrl).then(response => {
          setImgSrc(response);
        })
      }
  }, [user]);

  const acceptFriendRequest = async () => {
    try {
      const response = await putData<{ status: string }>(`friends/${friendShipId}`, { status: 'ACCEPTED' });

      console.log(response);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return (
    <div className="friendDetails">
      <div className="friendDetails__block">
        <img src={imgSrc ? URL.createObjectURL(imgSrc) : noPfp} alt={t("friend_details_pfp_alt")} className="friendDetails__block--img" />

        <p className="friendDetails__block--text">{`${user?.firstName} ${user?.lastName}`}</p>
      </div>

      {isRequest ? (
        <button
          className="friendDetails__button"
          onClick={acceptFriendRequest}
        >
          {t("friend_details_accept_button")}
        </button>
      ) : (
        <button
          className="friendDetails__button"
          onClick={() => navigate(`../profile/${user?.id}`)}
        >
          {t("friend_details_see_profile_button")}
        </button>
      )}
    </div>
  );
};