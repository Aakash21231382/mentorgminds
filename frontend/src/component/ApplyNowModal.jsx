import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { leadsApi } from '../api/leadsApi';
import { toast } from 'react-toastify';
import '../assets/css/ApplyNowModal.css';

const ApplyNowModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', courseInterest: '',
    qualification: '', workExperience: '', city: '', message: '',
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);

  const qualificationOptions  = ['10th', '12th', 'Graduate', 'Post Graduate', 'Other'];
  const workExperienceOptions = ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())       e.fullName       = 'Full name is required';
    if (!formData.email.trim())          e.email          = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                         e.email          = 'Enter a valid email';
    if (!formData.phone.trim())          e.phone          = 'Phone number is required';
    if (!formData.courseInterest.trim()) e.courseInterest = 'Please specify a course';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await leadsApi.submitAdmission(formData);
      if (data.success) { setSuccess(true); setTimeout(onClose, 3000); }
      else toast.error(data.message || 'Something went wrong.');
    } catch {
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="anm-overlay">
        <div className="anm-card">
          <div className="anm-success">
            <div className="anm-success-icon">✓</div>
            <h2 className="anm-success-title">Application Submitted!</h2>
            <p className="anm-success-text">Thank you! We'll contact you soon to guide you through the next steps.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anm-overlay">
      <div className="anm-card">

        <button className="anm-close" onClick={onClose} aria-label="Close"><FaTimes /></button>

        <div className="anm-header">
          <span className="anm-title">Apply Now</span>
          <span className="anm-subtitle">Take the first step towards your future — fill in your details below</span>
        </div>

        <div className="anm-body">
          <form className="anm-form" onSubmit={handleSubmit}>

            <div className="anm-row">
              <div className="anm-group">
                <label className="anm-label">Full Name <span className="anm-required">*</span></label>
                <input
                  type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} placeholder="Your full name"
                  className={`anm-input${errors.fullName ? ' anm-input--error' : ''}`}
                />
                {errors.fullName && <span className="anm-error">{errors.fullName}</span>}
              </div>
              <div className="anm-group">
                <label className="anm-label">Phone Number <span className="anm-required">*</span></label>
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="Your phone number"
                  className={`anm-input${errors.phone ? ' anm-input--error' : ''}`}
                />
                {errors.phone && <span className="anm-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="anm-group">
              <label className="anm-label">Email Address <span className="anm-required">*</span></label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com"
                className={`anm-input${errors.email ? ' anm-input--error' : ''}`}
              />
              {errors.email && <span className="anm-error">{errors.email}</span>}
            </div>

            <div className="anm-group">
              <label className="anm-label">Course / Program Interest <span className="anm-required">*</span></label>
              <input
                type="text" name="courseInterest" value={formData.courseInterest}
                onChange={handleChange} placeholder="e.g. Data Science, MBA, Full Stack Development..."
                className={`anm-input${errors.courseInterest ? ' anm-input--error' : ''}`}
              />
              {errors.courseInterest && <span className="anm-error">{errors.courseInterest}</span>}
            </div>

            <div className="anm-row">
              <div className="anm-group">
                <label className="anm-label">Highest Qualification</label>
                <select name="qualification" value={formData.qualification} onChange={handleChange} className="anm-select">
                  <option value="">Select qualification</option>
                  {qualificationOptions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div className="anm-group">
                <label className="anm-label">Work Experience</label>
                <select name="workExperience" value={formData.workExperience} onChange={handleChange} className="anm-select">
                  <option value="">Select experience</option>
                  {workExperienceOptions.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>

            <div className="anm-group">
              <label className="anm-label">City</label>
              <input
                type="text" name="city" value={formData.city}
                onChange={handleChange} placeholder="Your city"
                className="anm-input"
              />
            </div>

            <div className="anm-group">
              <label className="anm-label">Message / Any Query</label>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} placeholder="Any specific queries or expectations..."
                rows={3} className="anm-textarea"
              />
            </div>

            <button type="submit" className="anm-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyNowModal;