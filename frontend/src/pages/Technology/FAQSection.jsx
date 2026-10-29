import React, { useState, useEffect } from "react";
import T from "../../context/T";
import "../../assets/css/technology/FAQSection.css";
import { FaSearch } from "react-icons/fa";
import { technologyApi } from "../../api/technologyApi";

// newline-separated string → array
const parseLines = (v) => {
  if (!v) return [];
  return v.split('\n').map(s => s.trim()).filter(Boolean);
};

const FAQSection = () => {
  const [settings,    setSettings]    = useState(null);
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    technologyApi.getFaqData()
      .then(d => {
        if (d.success) {
          setSettings(d.settings || null);
          const list = d.items || [];
          setItems(list);
          if (list.length > 0) setSelectedFaq(list[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  const headingNormal = settings?.HeadingNormal || 'Frequently';
  const headingOrange = settings?.HeadingOrange || 'Asked Questions';

  const filteredItems = items.filter(item =>
    item.Question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const faq = selectedFaq || items[0];
  const bullets  = parseLines(faq?.BulletPoints);
  const examples = parseLines(faq?.Examples);

  return (
    <section className="faq-section">
      <div className="container faq-container">

        {/* Header */}
        <div className="faq-main-header text-center">
          <h2>
            <T>{headingNormal}</T>{' '}
            <span><T>{headingOrange}</T></span>
          </h2>
        </div>

        <div className="faq-content-layout">

          {/* Left Sidebar — question list */}
          <div className="faq-sidebar">
            <div className="faq-search-box">
              <FaSearch className="faq-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="faq-search-input"
              />
            </div>
            <div className="faq-questions-list">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div
                    key={item.Id}
                    className={`faq-question-item ${faq?.Id === item.Id ? 'active' : ''}`}
                    onClick={() => setSelectedFaq(item)}
                  >
                    <span className="faq-number">{index + 1}</span>
                    <p className="faq-q-text"><T>{item.Question}</T></p>
                  </div>
                ))
              ) : (
                <p className="no-result"><T>No questions found</T></p>
              )}
            </div>
          </div>

          {/* Right Detail Area */}
          <div className="faq-details-area">
            <div className="faq-details-inner">
              <h3><T>{faq.Question}</T></h3>

              {faq.Answer        && <p><T>{faq.Answer}</T></p>}
              {faq.SubHeading    && <h4><T>{faq.SubHeading}</T></h4>}
              {faq.IntroText     && <p><T>{faq.IntroText}</T></p>}

              {bullets.length > 0 && (
                <ul className="faq-answer-bullets">
                  {bullets.map((bp, i) => <li key={i}><T>{bp}</T></li>)}
                </ul>
              )}

              {faq.OutroText     && <p><T>{faq.OutroText}</T></p>}
              {faq.ExampleHeading && <h5><T>{faq.ExampleHeading}</T></h5>}

              {examples.length > 0 && (
                <ul className="faq-answer-bullets">
                  {examples.map((ex, j) => <li key={j}><T>{ex}</T></li>)}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
