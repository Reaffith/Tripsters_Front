import { useTranslation } from "react-i18next";
import picAbout1 from "../../pics/home-about1.jpg";
import pic1 from "../../pics/people.png";
import pic2 from "../../pics/home-block1.png";
import pic3 from "../../pics/home-block2.png";
import pic4 from "../../pics/people2.png";
import point1 from "../../pics/point1.svg";
import point2 from "../../pics/point2.svg";
import point3 from "../../pics/point3.svg";
import point4 from "../../pics/point4.svg";
import line1 from "../../pics/Line1.svg";
import line2 from "../../pics/Line2.svg";
import line3 from "../../pics/line3.svg";
import line4 from "../../pics/Line4.svg";

import "./Home.scss";
import { Link } from "react-router-dom";

export const Home = () => {
  const { t } = useTranslation();

  return (
    <main className="home">
      <section className="home__welcome">
        <div className="home__welcome--block1">
          <h1 className="home__welcome--block1--header">
            {t("home_welcome_header")}
          </h1>

          <p className="home__welcome--block1--text">
            {t("home_welcome_text")}
          </p>

          <Link to="trips/create" className="home__welcome--block1--button">
            {t("home_welcome_button")}
          </Link>
        </div>

        <div className="home__welcome--block2">
          <div className="home__welcome--block2--block green-block">
            <div className="home__welcome--block2--block--content">
              <img
                src={pic1}
                alt="people"
                className="home__welcome--block2--block--content--pic"
              />

              <p className="home__welcome--block2--block--content--text">
                {t("home_welcome_join")}
              </p>
            </div>

            <p className="home__welcome--block2--block--text">
              {t("home_welcome_join_text")}
            </p>
          </div>

          <div className="home__welcome--block2--block picture--block">
            <img src={pic2} className="picture--block--pic" />
          </div>

          <div className="home__welcome--block2--block picture--block">
            <img src={pic3} className="picture--block--pic" />
          </div>

          <div className="home__welcome--block2--block green-block">
            <img src={pic4} alt="" className="green-block-pic" />
          </div>
        </div>
      </section>

      <section className="home__about">
        <h2 className="home__about--header">
          {t("home_about_header")}
        </h2>

        <img
          src={picAbout1}
          alt="Travelling with friends"
          className="home__about--pic about-pic1"
        />

        <div className="home__about-block info-block1">
          <h4 className="home__about-block--header">
            {t("home_about_block1_header")}
          </h4>

          <p className="home__about-block--text">
            {t("home_about_block1_text1")}
          </p>

          <p className="home__about-block--text">
            {t("home_about_block1_text2")}
          </p>
        </div>
      </section>

      <section className="home__help">
        <h2 className="home__help--header">{t("home_help_header")}</h2>

        <div className="home__help--block">
          <div className="home__help--block--container">
            <h3 className="home__help--block--container--header">
              {t("home_help_block1_header")}
            </h3>

            <p className="home__help--block--container--text">
              {t("home_help_block1_text")}
            </p>
          </div>

          <div className="home__help--block--pic first-pic-block">
            <img src={point1} alt=""  className="p1"/>

            <img src={line1} alt="" />
          </div>
        </div>

        <div className="home__help--block">
          <div className="home__help--block--container">
            <h3 className="home__help--block--container--header">
              {t("home_help_block2_header")}
            </h3>

            <p className="home__help--block--container--text">
              {t("home_help_block2_text")}
            </p>
          </div>

          <div className="home__help--block--pic">
            <img src={point2} alt="" />

            <img src={line2} alt="" />
          </div>
        </div>

        <div className="home__help--block">
          <div className="home__help--block--container">
            <h3 className="home__help--block--container--header">
              {t("home_help_block3_header")}
            </h3>

            <p className="home__help--block--container--text">
              {t("home_help_block3_text")}
            </p>
          </div>

          <div className="home__help--block--pic">
            <img src={point3} alt="" />

            <img src={line3} alt="" />
          </div>
        </div>

        <div className="home__help--block">
          <div className="home__help--block--container">
            <h3 className="home__help--block--container--header">
              {t("home_help_block4_header")}
            </h3>

            <p className="home__help--block--container--text">
              {t("home_help_block4_text")}
            </p>
          </div>

          <div className="home__help--block--pic last-pic-block">
            <img src={point4} alt="" />

            <img src={line4} alt="" />
          </div>
        </div>
      </section>

      <Link to="trips/create" className="home__welcome--block1--button button-about">
        {t("home_welcome_button")}
      </Link>

    </main>
  );
};
