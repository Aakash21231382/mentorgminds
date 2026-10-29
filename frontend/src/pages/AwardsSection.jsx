import { useState, useEffect } from "react";
import T from "../context/T";
import "../assets/css/AwardsSection.css";
import { awardsApi } from "../api/awardsApi";

const AwardsSection = () => {
  const [config,  setConfig]  = useState(null);
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      awardsApi.getConfig(),
      awardsApi.getCards(),
    ])
      .then(([cfgRes, cardsRes]) => {
        if (cfgRes.success   && cfgRes.config)  setConfig(cfgRes.config);
        if (cardsRes.success && cardsRes.cards) setCards(cardsRes.cards);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!config && cards.length === 0) return null;

  return (
    <>
      {/* ── Awards Section (dark bg) ── */}
      <section className="awards-section">
        <div className="award-circle-left"></div>
        <div className="award-circle-top"></div>
        <div className="award-circle-right"></div>
        <div className="award-grid"></div>

        <div className="container awards-container">
          {/* Heading */}
          {(config?.HeadingNormal || config?.HeadingOrange) && (
            <div className="award-heading">
              <h2 className="award-title">
                {config.HeadingNormal && <T>{config.HeadingNormal}</T>}
                {config.HeadingOrange && <span> <T>{config.HeadingOrange}</T></span>}
              </h2>
            </div>
          )}

          <div className="award-wrapper">
            {/* Left image */}
            {config?.MainImage && (
              <div className="award-left">
                <img src={config.MainImage} alt="Awards" />
              </div>
            )}

            {/* Right cards */}
            {cards.length > 0 && (
              <div className="award-right">
                <div className="award-cards">
                  {cards.map((item) => (
                    <div className="award-card" key={item.Id}>
                      {item.CardImage && (
                        <img src={item.CardImage} alt={item.Title || 'award'} />
                      )}
                      {item.DataText  && <h5><T>{item.DataText}</T></h5>}
                      {item.Title     && <h4><T>{item.Title}</T></h4>}
                      {item.Description && <p><T>{item.Description}</T></p>}
                    </div>
                  ))}
                </div>

                {/* Dots — show only if more than 3 cards */}
                {cards.length > 3 && (
                  <div className="slider-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot active"></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Learner Support Section ── */}
      {(config?.SupportHeadingBold || config?.SupportHeadingNormal || config?.SupportCard1Image || config?.SupportCard2Image) && (
        <div className="container awards-container">
          <div className="learner-support">
            {(config.SupportHeadingBold || config.SupportHeadingNormal) && (
              <h2>
                {config.SupportHeadingBold   && <span><T>{config.SupportHeadingBold}</T></span>}
                {config.SupportHeadingNormal && <> <T>{config.SupportHeadingNormal}</T></>}
              </h2>
            )}
            {config.SupportDesc && <p><T>{config.SupportDesc}</T></p>}

            {(config.SupportCard1Image || config.SupportCard2Image) && (
              <div className="support-cards">
                {config.SupportCard1Image && (
                  <div className="support-card orange">
                    <img src={config.SupportCard1Image} alt="Indian Support" />
                  </div>
                )}
                {config.SupportCard2Image && (
                  <div className="support-card blue">
                    <img src={config.SupportCard2Image} alt="Global Support" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AwardsSection;
