import { useState, useEffect } from "react";
import T from "../context/T";
import "../assets/css/SubscriptionBanner.css";
import { FaArrowRight, FaLightbulb, FaTrophy, FaStar, FaRocket, FaUsers, FaChartBar, FaCode, FaGraduationCap } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { subscriptionBannerApi } from "../api/subscriptionBannerApi";
import ApplyNowModal from "../component/ApplyNowModal";

// Icon name string → React component
const ICON_MAP = {
  BsStars, FaTrophy, TiMessages, FaLightbulb,
  FaStar, FaRocket, FaGraduationCap, FaUsers, FaChartBar, FaCode,
};

const DynIcon = ({ name }) => {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp /> : <BsStars />;
};

const SubscriptionBanner = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    subscriptionBannerApi.getSubscriptionBanner()
      .then(d => { if (d.success && d.data) setData(d.data); })
      .catch(console.error);
  }, []);

  if (!data || !data.IsActive) return null;

  const features = [
    { label: data.Feature1Label, icon: data.Feature1Icon, color: data.Feature1Color },
    { label: data.Feature2Label, icon: data.Feature2Icon, color: data.Feature2Color },
    { label: data.Feature3Label, icon: data.Feature3Icon, color: data.Feature3Color },
    { label: data.Feature4Label, icon: data.Feature4Icon, color: data.Feature4Color },
  ].filter(f => f.label);

  return (
    <section className="sub-banner">
      <div className="sub-circle sub-circle-1" />
      <div className="sub-circle sub-circle-2" />
      <div className="sub-dots" />

      <div className="container sub-inner">
        <div className="sub-content">
          <h2><T>{data.Heading}</T></h2>
          <p className="sub-desc"><T>{data.Description}</T></p>

          {features.length > 0 && (
            <div className="sub-features">
              {features.map((f, i) => (
                <div className="sub-feature-item" key={i}>
                  <span className="sub-feature-icon" style={f.color ? { backgroundColor: f.color } : undefined}>
                    <DynIcon name={f.icon} />
                  </span>
                  <span><T>{f.label}</T></span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="sub-btn"
          >
            <T>{data.BtnText || 'Register Now'}</T> <FaArrowRight size={14} />
          </button>
          
        </div>

        {data.Image && (
          <div className="sub-image">
            <img src={data.Image} alt="Subscription Banner" />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ApplyNowModal onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default SubscriptionBanner;