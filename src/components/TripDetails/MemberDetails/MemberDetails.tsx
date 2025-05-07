import { Dispatch, SetStateAction, useEffect, useState } from "react";

import noPfp from "../../../pics/no-pfp.png";
import { User } from "../../../types/User";
import "./MemberDetail.scss";
import { useNavigate } from "react-router-dom";
import { getPhoto } from "../../../api";

type Props = {
  user: User;
  setQuery ?: Dispatch<SetStateAction<string>>
};

export const MemberDetails: React.FC<Props> = ({
  user,
  setQuery = () => {}
}) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`../profile/${user?.id}`);
    setQuery('')
  }

  const [userPfp, setUserPfp] = useState<Blob>();

  useEffect(() => {
    if (user) {
      getPhoto(user.fileUrl).then(response => {
        setUserPfp(response);
      })
    }
  }, [user]);

  return (
    <div className="memberDetails">
      <div className="memberDetails__block">
        <img src={userPfp ? URL.createObjectURL(userPfp) : noPfp} alt="PFP" className="memberDetails__block--img" />

        <p
          className="memberDetails__block--text"
          onClick={onClick}
        >{`${user.firstName} ${user.lastName}`}</p>
      </div>
    </div>
  );
};
