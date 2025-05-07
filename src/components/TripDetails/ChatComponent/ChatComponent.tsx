import { useState } from "react";
import "./ChatComponent.scss";
import classNames from "classnames";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const ChatComponent = () => {
  const [isChat, setIsChat] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="chat">
      <nav className="chat__nav">
        <p
          className={classNames("chat__nav--item", { "chat-active": isChat })}
          onClick={() => {
            setIsChat(true);
            navigate('messages');
          }}
        >
          {t("chat_component_chat_nav_chat")}
        </p>
        <p
          className={classNames("chat__nav--item", { "chat-active": !isChat })}
          onClick={() => {
            setIsChat(false);
            navigate('votes');
          }}
        >
          {t("chat_component_chat_nav_votes")}
        </p>
      </nav>

      <Outlet />
    </div>
  );
};