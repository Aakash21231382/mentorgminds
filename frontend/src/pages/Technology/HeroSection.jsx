import React, { useState, useRef, useEffect } from 'react';
import T from '../../context/T';
import '../../assets/css/technology/HeroSection.css';

import HeroBg from '../../assets/images/Herosection-Bg.png';

import { FaChevronDown } from 'react-icons/fa';
import { MdOutlineSupportAgent, MdPlayCircleOutline, MdWorkOutline } from 'react-icons/md';
import { TbCertificate } from 'react-icons/tb';
import { HiMiniCheckBadge } from 'react-icons/hi2';
import { FaUsersGear } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { leadsApi } from '../../api/leadsApi';

// ── Country list (flag CDN + dial code) ──────────────────────
const COUNTRIES = [
  { code: 'IN', name: 'India',          dial: '+91',  flag: 'https://flagcdn.com/w40/in.png'  },
  { code: 'US', name: 'USA',            dial: '+1',   flag: 'https://flagcdn.com/w40/us.png'  },
  { code: 'GB', name: 'UK',             dial: '+44',  flag: 'https://flagcdn.com/w40/gb.png'  },
  { code: 'AE', name: 'UAE',            dial: '+971', flag: 'https://flagcdn.com/w40/ae.png'  },
  { code: 'SA', name: 'Saudi Arabia',   dial: '+966', flag: 'https://flagcdn.com/w40/sa.png'  },
  { code: 'AU', name: 'Australia',      dial: '+61',  flag: 'https://flagcdn.com/w40/au.png'  },
  { code: 'CA', name: 'Canada',         dial: '+1',   flag: 'https://flagcdn.com/w40/ca.png'  },
  { code: 'SG', name: 'Singapore',      dial: '+65',  flag: 'https://flagcdn.com/w40/sg.png'  },
  { code: 'DE', name: 'Germany',        dial: '+49',  flag: 'https://flagcdn.com/w40/de.png'  },
  { code: 'FR', name: 'France',         dial: '+33',  flag: 'https://flagcdn.com/w40/fr.png'  },
  { code: 'NZ', name: 'New Zealand',    dial: '+64',  flag: 'https://flagcdn.com/w40/nz.png'  },
  { code: 'ZA', name: 'South Africa',   dial: '+27',  flag: 'https://flagcdn.com/w40/za.png'  },
  { code: 'NG', name: 'Nigeria',        dial: '+234', flag: 'https://flagcdn.com/w40/ng.png'  },
  { code: 'KE', name: 'Kenya',          dial: '+254', flag: 'https://flagcdn.com/w40/ke.png'  },
  { code: 'PK', name: 'Pakistan',       dial: '+92',  flag: 'https://flagcdn.com/w40/pk.png'  },
  { code: 'BD', name: 'Bangladesh',     dial: '+880', flag: 'https://flagcdn.com/w40/bd.png'  },
  { code: 'NP', name: 'Nepal',          dial: '+977', flag: 'https://flagcdn.com/w40/np.png'  },
  { code: 'LK', name: 'Sri Lanka',      dial: '+94',  flag: 'https://flagcdn.com/w40/lk.png'  },
  { code: 'MY', name: 'Malaysia',       dial: '+60',  flag: 'https://flagcdn.com/w40/my.png'  },
  { code: 'PH', name: 'Philippines',    dial: '+63',  flag: 'https://flagcdn.com/w40/ph.png'  },
];

const HeroSection = () => {
  const [phone,       setPhone]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [country,     setCountry]     = useState(COUNTRIES[0]); // India default
  const [dropOpen,    setDropOpen]    = useState(false);
  const [search,      setSearch]      = useState('');
  const dropRef = useRef(null);

  // Click outside — dropdown band karo
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = phone.trim();

    if (!cleaned || cleaned.length < 6) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const data = await leadsApi.submitCallback({
        fullName: 'Website Visitor',
        phone: `${country.dial}${cleaned}`,
        domain: 'Technology Page',
      });
      if (data.success) {
        toast.success(" Request submitted! We'll call you soon.");
        setPhone('');
      } else {
        toast.error(data.message || 'Something went wrong. Try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
        className="ai-hero-section"
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        <div className="ai-hero-container container">

          {/* ================= LEFT CONTENT ================= */}
          <div className="ai-hero-left">
            <h1>
              <T>Master Agentic</T> <br />
              <span><T>AI & Generative AI</T></span>
            </h1>
            <h3><T>Build Autonomous AI That Thinks & Acts</T></h3>

            <ul className="ai-hero-list">
              <li>
                <HiMiniCheckBadge size={28} style={{ color: '#FDBA21' }} />
                <T>Build AI agents with LangChain, CrewAI & Hugging Face</T>
              </li>
              <li>
                <HiMiniCheckBadge size={28} style={{ color: '#FDBA21' }} />
                <T>Master Prompt Engineering, RAG, MCP & Multi-Agent AI</T>
              </li>
              <li>
                <HiMiniCheckBadge size={28} style={{ color: '#FDBA21' }} />
                <T>Connect AI with APIs, databases & external tools</T>
              </li>
              <li>
                <HiMiniCheckBadge size={28} style={{ color: '#FDBA21' }} />
                <T>Earn an Industry-Recognized AI Certification</T>
              </li>
            </ul>
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="ai-hero-right">
            <div className="ai-form-card">

              <div className="form-head-row">
                <div className="counsellor-icon">
                  <MdOutlineSupportAgent />
                </div>
                <div className="form-head-text">
                  <h4><T>Talk to a Counsellor</T></h4>
                  <p><T>Get expert guidance for your learning journey</T></p>
                </div>
              </div>

              {/* Phone Input with Country Dropdown */}
              <div className="ai-input-group">

                {/* Country selector */}
                <div ref={dropRef} className="ai-country-wrapper">
                  <div
                    className="country-code-box"
                    onClick={() => { setDropOpen(p => !p); setSearch(''); }}
                  >
                    <img src={country.flag} alt={country.code} />
                    <span>{country.dial}</span>
                    <FaChevronDown
                      className={`chevron-down ${dropOpen ? 'open' : ''}`}
                    />
                  </div>

                  {/* Dropdown list */}
                  {dropOpen && (
                    <div className="ai-country-dropdown">
                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="ai-country-search"
                      />
                      {/* List */}
                      <div className="ai-country-list">
                        {filteredCountries.map(c => (
                          <div
                            key={c.code}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCountry(c);
                              setDropOpen(false);
                              setSearch('');
                            }}
                            className={`ai-country-item ${country.code === c.code ? 'selected' : ''}`}
                          >
                            <img src={c.flag} alt={c.code} className="ai-country-flag" />
                            <span className="ai-country-name">{c.name}</span>
                            <span className="ai-country-dial">{c.dial}</span>
                          </div>
                        ))}
                        {filteredCountries.length === 0 && (
                          <p className="ai-country-empty">No country found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone input */}
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={15}
                />
              </div>

              <button
                className="ai-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : <T>Request a Call Back</T>}
              </button>

              <p className="ai-terms">
                <T>By click, i accept the</T> <strong><T>T&C</T></strong> <T>and</T> <strong><T>Privacy Policy</T></strong>.
              </p>

              <div className="form-footer-features">
                <div className="form-feat-item">
                  <FaUsersGear className="feat-icon" />
                  <span><T>Expert Mentors</T></span>
                </div>
                <div className="form-feat-item">
                  <MdPlayCircleOutline className="feat-icon" />
                  <span><T>Live & Interactive</T></span>
                </div>
                <div className="form-feat-item">
                  <TbCertificate className="feat-icon" />
                  <span><T>Industry Certificate</T></span>
                </div>
                <div className="form-feat-item">
                  <MdWorkOutline className="feat-icon" />
                  <span><T>Placement Support</T></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
  );
};

export default HeroSection;
