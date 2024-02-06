import { useState, useEffect } from "react";
import SocialMediaGuild from "../../common/SocialMedia/SocialMediaCard/SocialMediaCard";
import { fetchHomeCardData } from '../../../services/api';
import "./GuildCard.scss";

type TabType = "info" | "bigTime";

interface CardData {
  id: number;
  playername: string;
  twitch: string;
  twitter: string;
  bigtime: string;
  logo: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  infocontent: string;
  bigtimecontent: string;
}

export default function GuildCard({ data }: { data: CardData }) {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  const handleTabChange = (tabName: TabType) => {
    setActiveTab(tabName);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midCardWidth = rect.width / 2;
    const midCardHeight = rect.height / 2;

    const angleY = -(x - midCardWidth) / 8;
    const angleX = (y - midCardHeight) / 8;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    e.currentTarget.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.1)`;
    e.currentTarget.style.transition = "none";
    e.currentTarget.querySelector(".card-glow").style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, #ffffff30, transparent)`;
  };

  const handleMouseOut = (e: MouseEvent) => {
    e.currentTarget.style.transform = "rotateX(0) rotateY(0)";
    e.currentTarget.style.transition = "transform ease .5s";
  };

  useEffect(() => {
    const cards = document.querySelectorAll(".card__wrapper");

    cards?.forEach((el) => {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseout", handleMouseOut);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseout", handleMouseOut);
      };
    });
  }, []);

  return (
    <div className="guild-card__wrapper">
      <div className="card__wrapper" key={data.id}>
        <div className="front">
          <div className="card-glow"></div>
          <div className="card__header">
            <div className="player-name">{data.playername}</div>
            <SocialMediaGuild
              twitch={data.twitch}
              twitter={data.twitter}
              bigtime={data.bigtime}
            />
          </div>
          <div className="card__body">
            <div className="image__wrapper">
              <img src={`${import.meta.env.VITE_API_URL}${data.logo.data.attributes.url}`} alt={`Image`} />
            </div>
          </div>
          <div className="card__footer">
            <ul>
              {["info", "bigTime"].map((tab) => (
                <button
                  key={tab}
                  className={`${tab} ${activeTab === tab ? "active" : ""}`}
                  onClick={() => handleTabChange(tab as TabType)}
                  aria-selected={activeTab === tab}
                >
                  {tab === "info" ? (
                    "Présentation".toUpperCase()
                  ) : (
                    <img
                      src={`${import.meta.env.CDN_URL}/images/assets/icons/logo_bigtime.svg`}
                      height={"25px"}
                      alt="logo bigtime"
                    />
                  )}
                </button>
              ))}
            </ul>
            <div className="content">
              <p>{activeTab === 'info' ? data.infocontent : data.bigtimecontent}</p>
            </div>
          </div>
        </div>
        <div className="back">
          <img
            src={`${import.meta.env.CDN_URL}/images/assets/cards/back-card.png`}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
