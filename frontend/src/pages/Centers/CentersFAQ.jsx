import React, { useState, useEffect } from 'react';
import { FaSearch, FaQuestionCircle } from 'react-icons/fa';
import { centresFAQApi } from '../../api/centresFAQApi';
import '../../assets/css/centers/CentersFAQ.css';
import T from '../../context/T';

const CentersFAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await centresFAQApi.getActive();
        if (response.success && response.data) {
          // Map API data to component format
          const mappedData = response.data.map(item => ({
            id: item.Id,
            question: item.Question,
            answer: item.Answer,
            subHeading: item.SubHeading,
            introText: item.IntroText,
            bulletPoints: item.bulletPoints, // Already parsed by backend
            outroText: item.OutroText
          }));
          setFaqData(mappedData);
          if (mappedData.length > 0) {
            setSelectedFaq(mappedData[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch FAQ data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredFaqs = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render if no data
  if (loading) {
    return null; // or return a loading spinner
  }

  if (faqData.length === 0) {
    return null; // Don't show section if no active FAQs
  }

  return (
    <section className="cn-faq-wrapper container">
      <div className="cn-faq-container">
        
        {/* Header */}
        <div className="cn-faq-header">
          <span className="cn-faq-badge"><T>Got Questions?</T></span>
          <h2 className="cn-faq-title">
            <T>Frequently Asked</T> <span><T>Questions</T></span>
          </h2>
          <p className="cn-faq-subtitle">
            <T>Find answers to common queries regarding our offline learning support centres and admissions.</T>
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="cn-faq-grid">
          
          {/* Left Column: Search & Questions List */}
          <div className="cn-faq-sidebar">
            <div className="cn-faq-search">
              <FaSearch className="cn-faq-search-icon" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  const matched = faqData.filter((item) =>
                    item.question.toLowerCase().includes(val.toLowerCase())
                  );
                  if (matched.length > 0 && !matched.some((item) => item.id === selectedFaq?.id)) {
                    setSelectedFaq(matched[0]);
                  }
                }}
                className="cn-faq-search-input"
              />
            </div>

            <div className="cn-faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, index) => (
                  <div
                    key={item.id}
                    className={`cn-faq-card-item ${selectedFaq?.id === item.id ? "active" : ""}`}
                    onClick={() => setSelectedFaq(item)}
                  >
                    <span className="cn-faq-index">{index + 1}</span>
                    <p className="cn-faq-card-text"><T>{item.question}</T></p>
                  </div>
                ))
              ) : (
                <p className="cn-faq-empty"><T>No matching questions found.</T></p>
              )}
            </div>
          </div>

          {/* Right Column: Selected FAQ Details */}
          <div className="cn-faq-details-box">
            {selectedFaq ? (
              <div className="cn-faq-details-inner">
                <h3>
                  <FaQuestionCircle className="cn-faq-q-icon" size={22} />
                  <T>{selectedFaq.question}</T>
                </h3>
                <p><T>{selectedFaq.answer}</T></p>

                {selectedFaq.subHeading && <h4><T>{selectedFaq.subHeading}</T></h4>}
                {selectedFaq.introText && <p><T>{selectedFaq.introText}</T></p>}

                {selectedFaq.bulletPoints && (
                  <ul className="cn-faq-bullets">
                    {selectedFaq.bulletPoints.map((bp, i) => (
                      <li key={i}><T>{bp}</T></li>
                    ))}
                  </ul>
                )}

                {selectedFaq.outroText && <p><T>{selectedFaq.outroText}</T></p>}
              </div>
            ) : (
              <div className="cn-faq-empty"><T>Please select a question from the list.</T></div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CentersFAQ;