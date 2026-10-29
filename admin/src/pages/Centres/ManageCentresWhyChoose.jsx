import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaImage, FaSave, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { adminApi } from '../../api/adminApi';
import { API_BASE_URL } from '../../config/api';
import '../../assets/css/ManageCentres.css';
import PageLoader from '../../components/PageLoader';

const ManageCentresWhyChoose = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    description: '',
    displayOrder: 0,
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await adminApi.centresWhyChoose.getAll();
      console.log('Why Choose Response:', response); // Debug log
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image to server
  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/single`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.success ? data.url : null;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      let imageUrl = formData.image;
      if (formData.image && typeof formData.image !== 'string') {
        imageUrl = await uploadImage(formData.image);
        if (!imageUrl) {
          toast.error('Image upload failed');
          return;
        }
      }

      const payload = {
        ...formData,
        image: imageUrl,
        id: editingId || null
      };

      const response = await adminApi.centresWhyChoose.upsert(payload);
      
      if (response.success) {
        toast.success(response.message);
        fetchItems();
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to save item');
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image: null,
      title: '',
      description: '',
      displayOrder: 0,
      isActive: true
    });
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  // Edit item
  const handleEdit = (item) => {
    setEditingId(item.Id);
    setFormData({
      image: item.Image,
      title: item.Title,
      description: item.Description,
      displayOrder: item.DisplayOrder || 0,
      isActive: item.IsActive
    });
    setImagePreview(item.Image || '');
    setShowForm(true);
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await adminApi.centresWhyChoose.delete(id);
      if (response.success) {
        toast.success('Item deleted successfully');
        fetchItems();
      }
    } catch (error) {
      toast.error('Failed to delete item');
      console.error(error);
    }
  };

  // Toggle status
  const handleToggle = async (id) => {
    try {
      await adminApi.centresWhyChoose.toggle(id);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="manage-offline-centres">
      <div className="moc-card">
        <div className="moc-header">
          <div>
            <h2 className="moc-title">Why Choose Us - Centres</h2>
            <p className="moc-subtitle">Manage feature cards displayed on centres page</p>
          </div>
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> Add New Item
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="moc-form-container">
          <div className="moc-form-header">
            <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <button className="btn-close-form" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="moc-form">
            <div className="moc-form-group">
              <label><FaImage /> Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="moc-file-input"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="moc-image-preview" />
              )}
            </div>

            <div className="moc-form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Industry-Ready Curriculum"
                required
              />
            </div>

            <div className="moc-form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description about this feature"
                rows="3"
                required
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
                <FaSave /> {editingId ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Table */}
      {loading ? (
        <PageLoader message="Loading items..." />
      ) : (
        <div className="moc-card">
          <table className="moc-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                    No items found. Add your first item!
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.Id}>
                    <td>
                      {item.Image && (
                        <img 
                          src={item.Image} 
                          alt={item.Title}
                          className="moc-location-thumb"
                        />
                      )}
                    </td>
                    <td><strong>{item.Title}</strong></td>
                    <td>{item.Description}</td>
                    <td>{item.DisplayOrder}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(item.Id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          color: item.IsActive ? '#38a169' : '#a0aec0'
                        }}
                      >
                        {item.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td>
                      <div className="moc-action-buttons">
                        <button 
                          className="btn-edit-small"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete-small"
                          onClick={() => handleDelete(item.Id)}
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

export default ManageCentresWhyChoose;
