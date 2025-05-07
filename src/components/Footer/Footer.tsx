import { useTranslation } from "react-i18next";
import "./Footer.scss";
import logo from "../../pics/logo.svg";

export const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="footer">
      <div className="footer__creators">
        <h3 className="footer__creators--header">{t("footer_creators_header")}</h3>

        <p className="footer__creators--item">
          <a
            href="https://github.com/Reaffith"
            target="_blank"
            className="footer__creators--item--link"
          >
            {t("footer_creator1_name")}
          </a>{" "}
          - {t("footer_creator1_role")}
        </p>

        <p className="footer__creators--item">
          <a
            href="https://github.com/qreqit"
            target="_blank"
            className="footer__creators--item--link"
          >
            {t("footer_creator2_name")}
          </a>{" "}
          - {t("footer_creator2_role")}
        </p>
      </div>

      <div className="footer__block">
        <img
          src={logo}
          alt={t("footer_logo_alt")}
          className="footer__block--logo"
          onClick={scrollToTop}
        />
        <p className="footer__block--text">{t("footer_text")}</p>
      </div>

      <p className="footer__contact">
        {t("footer_contact_label")}
        <br />
        <a href="mailto:tripstersma@gmail.com">tripstersma@gmail.com</a>
      </p>
    </div>
  );
};
