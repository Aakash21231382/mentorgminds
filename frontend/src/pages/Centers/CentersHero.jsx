import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/centers/CentersHero.css';
import { FaCheckCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api';
import T from '../../context/T';

const CentersHero = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    centre: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.centre) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/center-visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Visit booked successfully! We'll contact you soon.");
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          centre: ''
        });
      } else {
        toast.error(data.message || "Failed to book visit");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cn-hero-section">
      <div className="container">
        <div className="row cn-hero-row align-items-center">
          
          {/* Left Side: Content, Bullet Points & Stats */}
          <div className="col-12 col-lg-7 cn-hero-content">
            
            <h1 className="cn-hero-title">
              <T>Learning Support Centres with</T> <br />
              <span className="sa-text-orange"><T>Classroom Training</T></span>
            </h1>
            
            <ul className="cn-hero-bullets">
              <li>
                <FaCheckCircle size={18} className='icon-circle'/>
                <span><T>Get job-ready with 100% classroom training & career support</T></span>
              </li>
              <li>
                <FaCheckCircle size={18} />
                <span><T>Advance in AI, Data Science & Full Stack with industry-ready curriculum</T></span>
              </li>
              <li>
                <FaCheckCircle size={18} />
                <span><T>Career guidance & hands-on projects - Build skills that employers value</T></span>
              </li>
              <li>
                <FaCheckCircle size={18} />
                <span><T>Soft skills training, profile building & interview preparation</T></span>
              </li>
            </ul>
            
            {/* Bottom Stats Bar */}
            <div className="cn-hero-stats-box">
              <div className="cn-stat-item">
                <span><T>Scholarships</T></span>
                <h5><T>Upto 50%*</T></h5>
              </div>
              <div className="cn-stat-divider"></div>
              <div className="cn-stat-item">
                <span><T>Average Salary Hike</T></span>
                <h5><T>50%</T></h5>
              </div>
              <div className="cn-stat-divider"></div>
              <div className="cn-stat-item">
                <span><T>For Enquiry</T></span>
                <h5><T>1800 210 7070</T></h5>
              </div>
            </div>

          </div>

          {/* Right Side: Floating Lead Form Card */}
          <div className="col-12 col-lg-5">
            <div className="cn-form-card-wrapper">
              <div className="cn-form-card">
                
                <h3 className="cn-form-title"><T>Get started with your details</T></h3>
                
                <form onSubmit={handleSubmit}>
                  
                  {/* Name */}
                  <div className='input'>
                    <div className="cn-form-group">
                      <label className="cn-form-label"><T>Full Name *</T></label>
                      <input 
                        type="text"
                        name="name"
                        className="cn-form-input"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="cn-form-group">
                      <label className="cn-form-label"><T>Email *</T></label>
                      <input 
                        type="email"
                        name="email"
                        className="cn-form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="cn-form-group">
                    <label className="cn-form-label"><T>Phone Number *</T></label>
                    <input 
                      type="tel"
                      name="phone"
                      className="cn-form-input"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      required
                    />
                  </div>
                  
                  <div className='input'>
                    {/* City Dropdown */}
                    <div className="cn-form-group">
                      <label className="cn-form-label"><T>City *</T></label>
                      <select 
                        name="city"
                        className="cn-form-select"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      >
                        <option value=""><T>Select City</T></option>
                        <option value="Noida"><T>Noida</T></option>
                        <option value="Delhi"><T>Delhi</T></option>
                        <option value="Bangalore"><T>Bangalore</T></option>
                        <option value="Pune"><T>Pune</T></option>
                        <option value="Mumbai"><T>Mumbai</T></option>
                        <option value="Hyderabad"><T>Hyderabad</T></option>
                      </select>
                    </div>

                    {/* Learning Support Centre Dropdown */}
                    <div className="cn-form-group mb-4">
                      <label className="cn-form-label"><T>Learning Support Centre *</T></label>
                      <select 
                        name="centre"
                        className="cn-form-select"
                        value={formData.centre}
                        onChange={handleChange}
                        required
                      >
                        <option value=""><T>Select Learning Support Centre</T></option>
                        <option value="Sector 62 Centre"><T>Sector 62 Centre (Noida)</T></option>
                        <option value="Connaught Place Centre"><T>Connaught Place Centre (Delhi)</T></option>
                        <option value="Koramangala Centre"><T>Koramangala Centre (Bangalore)</T></option>
                        <option value="Hinjewadi Centre"><T>Hinjewadi Centre (Pune)</T></option>
                        <option value="Andheri Centre"><T>Andheri Centre (Mumbai)</T></option>
                        <option value="Hitech City Centre"><T>Hitech City Centre (Hyderabad)</T></option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="cn-form-submit-btn"
                    disabled={loading}
                  >
                    {loading ? <T>Booking...</T> : <T>Book a Visit</T>}
                  </button>

                </form>

              </div>
            </div>
          </div>

        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default CentersHero;