import { FormEvent, useState } from "react";
import { logIn } from "../../api";
import { useTranslation } from 'react-i18next';

import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";

import { ColorRing } from "react-loader-spinner";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const naviagate = useNavigate();
  const { t } = useTranslation();

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email && password) {
      setLoading(true);
      try {
        await logIn({ email, password });
      } catch (error) {
        console.error("Error logging in:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const goToRegisterPage = () => {
    naviagate("../reg");
  };
  return (
    <>
      <main className="login">
        <div className="login__block">
          <h1 className="login__block--header">{t("login_page_header")}</h1>
          <form onSubmit={formSubmit} className="login__block--form">
            <label htmlFor="email" className="login__block--form--label">
              {t("login_page_email_label")}
            </label>

            <input
              type="email"
              id="email"
              className="login__block--form--input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("login_page_email_placeholder")}
            />

            <label htmlFor="password" className="login__block--form--label">
              {t("login_page_password_label")}
            </label>

            <input
              type="password"
              id="password"
              className="login__block--form--input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("login_page_password_placeholder")}
            />

            <button
              className="login__block--form--button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ColorRing
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "darkgray",
                    "darkgray",
                    "darkgray",
                    "darkgray",
                    "darkgray",
                  ]}
                />
              ) : (
                <span
                  style={{
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("login_page_login_button")}
                </span>
              )}
            </button>
          </form>

          <p className="login__block--register">
            {t("login_page_register_text")}
            <span
              className="login__block--register--link"
              onClick={goToRegisterPage}
            >
              {t("login_page_register_link")}
            </span>
            {t("login_page_register_end")}
          </p>
        </div>
      </main>
    </>
  );
};