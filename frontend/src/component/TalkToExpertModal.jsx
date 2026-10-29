

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { leadsApi } from '../api/leadsApi';
import { toast } from 'react-toastify';
import '../assets/css/TalkToExpertModal.css';

const TalkToExpertModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', domain: '', message: '',
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const domainOptions = [
    'Technology', 'Data Science', 'MBA',
    'Certifications', 'Study Abroad', 'Mentorship', 'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required';
    if (!formData.phone.trim())    e.phone    = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await leadsApi.submitCallback(formData);
      if (data.success) { setSuccess(true); setTimeout(onClose, 3000); }
      else toast.error(data.message || 'Something went wrong.');
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    // Outside click hatane ke liye overlay se onClick hata diya
    return (
      <div className="tte-overlay">
        <div className="tte-card">
          <div className="tte-success">
            <div className="tte-success-icon">✓</div>
            <h2 className="tte-success-title">Thank You!</h2>
            <p className="tte-success-text">We've received your request. Our expert will contact you soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Outside click hatane ke liye overlay se onClick hata diya
    <div className="tte-overlay">
      <div className="tte-card">

        <button className="tte-close" onClick={onClose} aria-label="Close"><FaTimes /></button>

        <div className="tte-header">
          <span className="tte-title">Talk to an Expert</span>
          <span className="tte-subtitle">Fill in your details and our expert will reach out to guide you</span>
        </div>

        <div className="tte-body">
          <form className="tte-form" onSubmit={handleSubmit}>

            <div className="tte-group">
              <label className="tte-label">Full Name <span className="tte-required">*</span></label>
              <input
                type="text" name="fullName" value={formData.fullName}
                onChange={handleChange} placeholder="Enter your full name"
                className={`tte-input${errors.fullName ? ' tte-input--error' : ''}`}
              />
              {errors.fullName && <span className="tte-error">{errors.fullName}</span>}
            </div>

            <div className="tte-group">
              <label className="tte-label">Phone Number <span className="tte-required">*</span></label>
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="Enter your phone number"
                className={`tte-input${errors.phone ? ' tte-input--error' : ''}`}
              />
              {errors.phone && <span className="tte-error">{errors.phone}</span>}
            </div>

            <div className="tte-group">
              <label className="tte-label">Email (Optional)</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Enter your email"
                className="tte-input"
              />
            </div>

            <div className="tte-group">
              <label className="tte-label">Domain of Interest</label>
              <select name="domain" value={formData.domain} onChange={handleChange} className="tte-select">
                <option value="">Select domain</option>
                {domainOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="tte-group">
              <label className="tte-label">Message (Optional)</label>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} placeholder="Tell us how we can help you..."
                rows={4} className="tte-textarea"
              />
            </div>

            <button type="submit" className="tte-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TalkToExpertModal;