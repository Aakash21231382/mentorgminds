import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaToggleOn, FaToggleOff, FaQuestionCircle } from 'react-icons/fa';
import { adminApi } from '../../api/adminApi';
import '../../assets/css/ManageCentres.css';
import PageLoader from '../../components/PageLoader';

const ManageCentresFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    subHeading: '',
    introText: '',
    bulletPoints: [''],
    outroText: '',
    displayOrder: 0,
    isActive: true
  });

  // Fetch all FAQs
  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await adminApi.centresFAQ.getAll();
      console.log('FAQ Response:', response); // Debug log
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch FAQs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle bullet point change
  const handleBulletChange = (index, value) => {
    const newBullets = [...formData.bulletPoints];
    newBullets[index] = value;
    setFormData(prev => ({ ...prev, bulletPoints: newBullets }));
  };

  // Add bullet point
  const addBullet = () => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, '']
    }));
  };

  // Remove bullet point
  const removeBullet = (index) => {
    if (formData.bulletPoints.length === 1) return;
    const newBullets = formData.bulletPoints.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, bulletPoints: newBullets }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      toast.error('Question and answer are required');
      return;
    }

    // Filter out empty bullet points
    const filteredBullets = formData.bulletPoints.filter(b => b.trim() !== '');

    try {
      const payload = {
        ...formData,
        bulletPoints: filteredBullets.length > 0 ? filteredBullets : null,
        id: editingId || null
      };

      const response = await adminApi.centresFAQ.upsert(payload);
      
      if (response.success) {
        toast.success(response.message);
        fetchFAQs();
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to save FAQ');
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      subHeading: '',
      introText: '',
      bulletPoints: [''],
      outroText: '',
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Edit FAQ
  const handleEdit = (faq) => {
    setEditingId(faq.Id);
    setFormData({
      question: faq.Question,
      answer: faq.Answer,
      subHeading: faq.SubHeading || '',
      introText: faq.IntroText || '',
      bulletPoints: faq.BulletPoints && faq.BulletPoints.length > 0 ? faq.BulletPoints : [''],
      outroText: faq.OutroText || '',
      displayOrder: faq.DisplayOrder || 0,
      isActive: faq.IsActive
    });
    setShowForm(true);
  };

  // Delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await adminApi.centresFAQ.delete(id);
      if (response.success) {
        toast.success('FAQ deleted successfully');
        fetchFAQs();
      }
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error(error);
    }
  };

  // Toggle status
  const handleToggle = async (id) => {
    try {
      await adminApi.centresFAQ.toggle(id);
      fetchFAQs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="manage-offline-centres">
      <div className="moc-card">
        <div className="moc-header">
          <div>
            <h2 className="moc-title">FAQs - Centres</h2>
            <p className="moc-subtitle">Manage frequently asked questions for centres page</p>
          </div>
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> Add New FAQ
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="moc-form-container">
          <div className="moc-form-header">
            <h3>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
            <button className="btn-close-form" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="moc-form">
            <div className="moc-form-group">
              <label><FaQuestionCircle /> Question *</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the question"
                required
              />
            </div>

            <div className="moc-form-group">
              <label>Answer *</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Main answer to the question"
                rows="3"
                required
              />
            </div>

            <div className="moc-form-group">
              <label>Sub Heading (Optional)</label>
              <input
                type="text"
                name="subHeading"
                value={formData.subHeading}
                onChange={handleChange}
                placeholder="e.g., Visit Process & Timings"
              />
            </div>

            <div className="moc-form-group">
              <label>Intro Text (Optional)</label>
              <textarea
                name="introText"
                value={formData.introText}
                onChange={handleChange}
                placeholder="Introductory text before bullet points"
                rows="2"
              />
            </div>

            <div className="moc-form-group">
              <label>Bullet Points (Optional)</label>
              {formData.bulletPoints.map((bullet, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder={`Point ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {formData.bulletPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(index)}
                      className="btn-delete-small"
                      style={{ width: 'auto', padding: '0 15px' }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBullet}
                className="btn-add"
                style={{ fontSize: '0.85rem', padding: '8px 16px', marginTop: '5px' }}
              >
                <FaPlus /> Add Bullet Point
              </button>
            </div>

            <div className="moc-form-group">
              <label>Outro Text (Optional)</label>
              <textarea
                name="outroText"
                value={formData.outroText}
                onChange={handleChange}
                placeholder="Closing text after bullet points"
                rows="2"
              />
            </div>

            <div className="moc-form-row">
              <div className="moc-form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="moc-form-group">
                <label className="moc-checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>

            <div className="moc-form-actions">
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                <FaSave /> {editingId ? 'Update FAQ' : 'Add FAQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQs Table */}
      {loading ? (
        <PageLoader message="Loading FAQs..." />
      ) : (
        <div className="moc-card">
          <table className="moc-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Details</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                    No FAQs found. Add your first FAQ!
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.Id}>
                    <td><strong>{faq.Question}</strong></td>
                    <td style={{ maxWidth: '300px' }}>
                      {faq.Answer.substring(0, 100)}
                      {faq.Answer.length > 100 && '...'}
                    </td>
                    <td>
                      {faq.SubHeading && <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        <strong>Sub:</strong> {faq.SubHeading}
                      </div>}
                      {faq.BulletPoints && faq.BulletPoints.length > 0 && (
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          {faq.BulletPoints.length} bullet points
                        </div>
                      )}
                    </td>
                    <td>{faq.DisplayOrder}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(faq.Id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          color: faq.IsActive ? '#38a169' : '#a0aec0'
                        }}
                      >
                        {faq.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td>
                      <div className="moc-action-buttons">
                        <button 
                          className="btn-edit-small"
                          onClick={() => handleEdit(faq)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete-small"
                          onClick={() => handleDelete(faq.Id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCentresFAQ;
