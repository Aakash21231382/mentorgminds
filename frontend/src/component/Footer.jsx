import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import T from "../context/T";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import "../assets/css/Footer.css";
import GooglePay from "../assets/images/Google.png";
import App from "../assets/images/app.png";
import Logo from "../assets/images/footerLogo.png";

const Footer = () => {
  const [footerColumns, setFooterColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/footer/data`);
        if (res.data?.success) {
          setFooterColumns(res.data.columns || []);
        }
      } catch (err) {
        console.error("Footer fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="footer-section">
      <div className="footer-container container">
        <div className="footer-main-content">

          {/* ── Brand Column (static) ─────────────────────── */}
          <div className="footer-brand-col">
            <div className="footer-logo-wrapper">
              <img
                src={Logo}
                alt="Mentoring Minds Logo"
                className="footer-logo"
              />
              <div className="footer-logo-text">
                <h1>MENTORINGMINDS</h1>
                <span>Inspire. Guide. Empower.</span>
              </div>
            </div>

            <div className="footer-social-icons">
              <Link to="#" className="social-icon facebook">
                <FaFacebookF />
              </Link>
              <Link to="#" className="social-icon twitter">
                <FaTwitter />
              </Link>
              <Link to="#" className="social-icon linkedin">
                <FaLinkedinIn />
              </Link>
              <Link to="#" className="social-icon youtube">
                <FaYoutube />
              </Link>
              <Link to="#" className="social-icon instagram">
                <FaInstagram />
              </Link>
            </div>

            <div className="footer-app-section">
              <p className="app-title">
                <T>Get Our App Now!</T>
              </p>
              <div className="app-links">
                <Link to="#">
                  <img
                    src={GooglePay}
                    alt="Google Play Store"
                    className="app-badge"
                  />
                </Link>
                <Link to="#">
                  <img src={App} alt="Apple App Store" className="app-badge" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Dynamic Course Columns ────────────────────── */}
          <div className="footer-courses-wrapper">
            {loading ? (
              // Skeleton loader — same grid structure
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="footer-links-col">
                  <div className="footer-skeleton-heading" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="footer-skeleton-link" />
                  ))}
                </div>
              ))
            ) : footerColumns.length > 0 ? (
              footerColumns.map((col) => (
                <div key={col.Id} className="footer-links-col">
                  <h3 className="footer-heading">
                    <T>{col.Heading}</T>
                  </h3>
                  <ul className="footer-links-list">
                    {(col.links || []).map((link) => (
                      <li key={link.Id}>
                        <Link to={link.Url}>
                          <T>{link.Title}</T>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Footer Bottom Bar (static) ────────────────────── */}
      <div className="footer-bottom-wrapper">
        <div className="footer-full-divider"></div>
        <div className="footer-container container">
          <div className="footer-bottom-row">
            <ul className="footer-bottom-nav">
              <li><Link to="#"><T>ABOUT US</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>MEDIA</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>REFUND POLICY</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>PRIVACY POLICY</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>TERMS OF USE</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>CONTACT US</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>BLOG</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>INTERVIEW QUESTIONS</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>TUTORIALS</T></Link></li>
              <span className="separator">|</span>
              <li><Link to="#"><T>BECOME AN INSTRUCTOR</T></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
