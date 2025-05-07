/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../../pics/logo.svg";

import "./Header.scss";
import { useEffect, useState } from "react";
import { getAllUsers, getData } from "../../api";
import { User } from "../../types/User";
import { MemberDetails } from "../TripDetails/MemberDetails/MemberDetails";
import { IoMenu } from "react-icons/io5";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [usersToShow, setUsersToShow] = useState<User[]>([]);
  const width = useWindowWidth();
  const [isMenu, setIsMenu] = useState(false);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res));
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setUsersToShow(
        users.filter(
          (u) =>
            `${u.id}` === query ||
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(query.toLowerCase())
        )
      );
    } else if (query.length === 0) {
      setUsersToShow([]);
    }
  }, [query]);

  const changeLanguage = (lng: "en" | "ua") => {
    i18n.changeLanguage(lng);
  };

  const navigate = useNavigate();

  const regButtonClick = () => {
    navigate("auth/login");
  };

  const [user, setUser] = useState<User | undefined>();
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    getData("users/current").then(setUser);
  }, []);

  useEffect(() => {
    if (isMenu) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenu]);

  const [menuStyle, setMenuStyle] = useState({top: '-150vh'});

  useEffect(() => {
    if (isMenu) {
      setMenuStyle(width > 639 ? {top: '90px'} : {top: '60px'});
    } else {
      setMenuStyle({top: '-150vh'});
    }
  }, [isMenu])

  const location = useLocation();

  useEffect(() => {
    setIsMenu(false);
  }, [location])

  return (
    <nav className="header">
      <Link to="/" className="header__link logo">
        <img src={Logo} alt="Logo" className="header__link--pic" />
      </Link>

      {width > 850 && (
        <div className="header__linkBlock">
          <Link to="/trips/create" className="header__linkBlock--link">
            {t("header_create")}
          </Link>

          <Link to="/trips" className="header__linkBlock--link">
            {t("header_yourTrips")}
          </Link>

          <Link to="/friends" className="header__linkBlock--link">
            {t("header_friends")}
          </Link>

          <Link
            to={user ? `profile/${user.id}` : "/auth/reg"}
            className="header__linkBlock--link"
          >
            {t("header_profile")}
          </Link>

          <div className="header__linkBlock--box">
            <input
              type="text"
              placeholder={t("header_search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {query.length > 0 &&
              (usersToShow.length > 0 ? (
                <div className="header__linkBlock--box--block">
                  {usersToShow.map((u) => (
                    <MemberDetails key={u.id} user={u} setQuery={setQuery} />
                  ))}
                </div>
              ) : (
                <div className="header__linkBlock--box--block">
                  <h3 className="header__linkBlock--box--block--text">
                  {t("header_noUsers")}
                  </h3>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="header__block">
        {width <= 850 && (
          <div
            className="header__block--menu"
            onClick={() => {
              setIsMenu((prev) => !prev);
            }}
          >
            <IoMenu />

            <div className="header__linkBlock dropdownmenu" style={menuStyle}>
              <Link to="/trips/create" className="header__linkBlock--link">
                {t("header_create")}
              </Link>

              <Link to="/trips" className="header__linkBlock--link">
                {t("header_yourTrips")}
              </Link>

              <Link to="/friends" className="header__linkBlock--link">
                {t("header_friends")}
              </Link>

              <Link
                to={user ? `profile/${user.id}` : "/auth/reg"}
                className="header__linkBlock--link"
              >
                {t("header_profile")}
              </Link>


            </div>
          </div>
        )}

        <div className="header__block--lang">
          <p
            className="header__block--lang--option"
            onClick={() => changeLanguage("en")}
            style={{ cursor: "pointer" }}
          >
            EN
          </p>
          <p className="header__block--lang--option">/</p>
          <p
            className="header__block--lang--option"
            onClick={() => changeLanguage("ua")}
            style={{ cursor: "pointer" }}
          >
            UA
          </p>
        </div>

        {user ? (
          <div
            className="header_user"
            onMouseOver={() => setMouseOver(true)}
            onMouseOut={() => setMouseOver(false)}
          >
            <Link
              to={`/profile/${user.id}`}
              className="header_user"
            >{`${user.firstName} ${user.lastName}`}</Link>

            <div
              className="header_user--options"
              style={
                mouseOver
                  ? {
                      opacity: "1",
                      position: "absolute",
                      backgroundColor: "#ECF9EF",
                      cursor: "pointer",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      width: "100px",
                    }
                  : {
                      opacity: "0",
                      position: "absolute",
                      pointerEvents: "none",
                    }
              }
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.reload();
              }}
            >
              {t("header_logOut")}
            </div>
          </div>
        ) : (
          <div className="header__block--sign" onClick={regButtonClick}>
            <p>{t("header_login")}</p>
          </div>
        )}
      </div>
    </nav>
  );
};
