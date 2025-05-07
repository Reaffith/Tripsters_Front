import { useState } from "react";
import { registerUser } from "../../api";
import { ErrorBlock } from "../ErrorBlock/ErrorBlock";
import { useTranslation } from 'react-i18next';

import "./RegisterPage.scss";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");
  const { t } = useTranslation();

  async function onButtonClick() {
    localStorage.removeItem("authToken");

    if (
      email.length < 3 ||
      password.length < 3 ||
      password !== repeatPassword ||
      firstName.length < 1 ||
      lastName.length < 1
    ) {
      setError(t("register_page_error"));
      return;
    }

    const userData = {
      email,
      password,
      repeatPassword,
      firstName,
      lastName,
    };

    await registerUser(userData);
  }

  return (
    <>
      {error.length > 1 && <ErrorBlock error={error} setError={setError} />}
      <main className="register">
        <h1 className="register__header">{t("register_page_header")}</h1>
        <form className="register__form" autoComplete="off">
          <label htmlFor="email" className="register__form--label">
            {t("register_page_email_label")}
          </label>
          <input
            className="register__form--input"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            placeholder={t("register_page_email_placeholder")}
          />

          <div className="register__form--block">
            <div className="">
              <label htmlFor="password" className="register__form--label">
                {t("register_page_password_label")}
              </label>
              <input
                className="register__form--input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                placeholder={t("register_page_password_placeholder")}
              />
            </div>

            <div className="">
              {" "}
              <label htmlFor="repeatPassword" className="register__form--label">
                {t("register_page_repeat_password_label")}
              </label>
              <input
                className="register__form--input"
                id="repeatPassword"
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                autoComplete="off"
                placeholder={t("register_page_repeat_password_placeholder")}
              />
            </div>
          </div>

          <div className="register__form--block">
            <div className="">
              <label htmlFor="firstName" className="register__form--label">
                {t("register_page_first_name_label")}
              </label>
              <input
                className="register__form--input"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="off"
                placeholder={t("register_page_first_name_placeholder")}
              />
            </div>

            <div className="">
              <label htmlFor="lastName" className="register__form--label">
                {t("register_page_last_name_label")}
              </label>
              <input
                className="register__form--input"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
                placeholder={t("register_page_last_name_placeholder")}
              />
            </div>
          </div>
        </form>
        <button onClick={onButtonClick} className="register__button">
          {t("register_page_button")}
        </button>
      </main>
    </>
  );
};