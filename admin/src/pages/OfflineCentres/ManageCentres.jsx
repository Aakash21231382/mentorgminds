import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaPhone, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import { adminApi } from '../../api/adminApi';
import { API_BASE_URL } from '../../config/api';
import '../../assets/css/ManageCentres.css';

const ManageCentres = () => {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isNewCity, setIsNewCity] = useState(false);
  const [existingCities, setExistingCities] = useState([]);
  const [formData, setFormData] = useState({
    cityName: '',
    cityImage: null,
    locationName: '',
    locationAddress: '',
    locationImage: null,
    mapLink: '',
    contactNumber: '',
    displayOrder: 0,
    isActive: true
  });
  const [cityImagePreview, setCityImagePreview] = useState('');
  const [locationImagePreview, setLocationImagePreview] = useState('');

  // Fetch all centres
  const fetchCentres = async () => {
    setLoading(true);
    try {
      const response = await adminApi.offlineCentres.getAll();
      if (response.success) {
        setCentres(response.data);
        
        // Extract unique cities
        const cities = [...new Set(response.data.map(c => c.CityName))];
        setExistingCities(cities);
      }
    } catch (error) {
      toast.error('Failed to fetch centres');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
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
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (type === 'city') {
        setFormData(prev => ({ ...prev, cityImage: file }));
        setCityImagePreview(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, locationImage: file }));
        setLocationImagePreview(URL.createObjectURL(file));
      }
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

    if (!formData.cityName || !formData.locationName) {
      toast.error('City name and location name are required');
      return;
    }

    try {
      // Upload images if selected
      let cityImageUrl = null;
      let locationImageUrl = null;

      if (formData.cityImage && typeof formData.cityImage !== 'string') {
        cityImageUrl = await uploadImage(formData.cityImage);
      } else {
        cityImageUrl = formData.cityImage;
      }

      if (formData.locationImage && typeof formData.locationImage !== 'string') {
        locationImageUrl = await uploadImage(formData.locationImage);
      } else {
        locationImageUrl = formData.locationImage;
      }

      const payload = {
        ...formData,
        cityImage: cityImageUrl,
        locationImage: locationImageUrl,
        id: editingId || null
      };

      const response = await adminApi.offlineCentres.upsert(payload);
      
      if (response.success) {
        toast.success(response.message);
        fetchCentres();
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to save centre');
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cityName: '',
      cityImage: null,
      locationName: '',
      locationAddress: '',
      locationImage: null,
      mapLink: '',
      contactNumber: '',
      displayOrder: 0,
      isActive: true
    });
    setCityImagePreview('');
    setLocationImagePreview('');
    setEditingId(null);
    setShowAddForm(false);
    setIsNewCity(false);
  };

  // Handle city selection change
  const handleCitySelect = (e) => {
    const value = e.target.value;
    if (value === '__new__') {
      setIsNewCity(true);
      setFormData(prev => ({ ...prev, cityName: '', cityImage: null }));
      setCityImagePreview('');
    } else {
      setIsNewCity(false);
      // Find existing city data for image
      const existingCentre = centres.find(c => c.CityName === value);
      setFormData(prev => ({ 
        ...prev, 
        cityName: value,
        cityImage: existingCentre?.CityImage || null
      }));
      setCityImagePreview(existingCentre?.CityImage || '');
    }
  };

  // Edit centre
  const handleEdit = (centre) => {
    setEditingId(centre.Id);
    setIsNewCity(false);
    setFormData({
      cityName: centre.CityName,
      cityImage: centre.CityImage,
      locationName: centre.LocationName,
      locationAddress: centre.LocationAddress || '',
      locationImage: centre.LocationImage || '',
      mapLink: centre.MapLink || '',
      contactNumber: centre.ContactNumber || '',
      displayOrder: centre.DisplayOrder || 0,
      isActive: centre.IsActive
    });
    setCityImagePreview(centre.CityImage || '');
    setLocationImagePreview(centre.LocationImage || '');
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this centre?')) return;

    try {
      const response = await adminApi.offlineCentres.delete(id);
      if (response.success) {
        toast.success('Centre deleted successfully');
        fetchCentres();
      }
    } catch (error) {
      toast.error('Failed to delete centre');
      console.error(error);
    }
  };

  // Group centres by city
  const groupedCentres = centres.reduce((acc, centre) => {
    const city = centre.CityName;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(centre);
    return acc;
  }, {});

  return (
    <div className="manage-offline-centres">
      <div className="moc-header">
        <div>
          <h2>Manage  Centres</h2>
          <p>Add and manage cities and their centre locations</p>
        </div>
        <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
          <FaPlus /> Add New Centre
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="moc-form-container">
          <div className="moc-form-header">
            <h3>{editingId ? 'Edit Centre' : 'Add New Centre'}</h3>
            <button className="btn-close-form" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="moc-form">
            <div className="moc-form-row">
              <div className="moc-form-group">
                <label>Select City *</label>
                {editingId ? (
                  <input
                    type="text"
                    value={formData.cityName}
                    disabled
                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                  />
                ) : (
                  <select
                    value={isNewCity ? '__new__' : formData.cityName}
                    onChange={handleCitySelect}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '0.95rem',
                      border: '2px solid #cbd5e1',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Select Existing City or Add New --</option>
                    {existingCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                    <option value="__new__"> <FaPlus size={18} />Add New City</option>
                  </select>
                )}
              </div>

              {isNewCity && !editingId && (
                <div className="moc-form-group">
                  <label>New City Name *</label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai, Chennai"
                    required
                  />
                </div>
              )}
            </div>

            <div className="moc-form-row">
              <div className="moc-form-group">
                <label>
                  <FaImage /> City Image {!isNewCity && !editingId && '(Optional - Update if needed)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'city')}
                  className="moc-file-input"
                />
                {cityImagePreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={cityImagePreview} alt="City Preview" className="moc-image-preview" />
                    <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '5px' }}>
                      {isNewCity ? 'New city image' : 'Current city image'}
                    </p>
                  </div>
                )}
              </div>

              <div className="moc-form-group">
                <label>Location Name *</label>
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  placeholder="e.g., Hinjewadi Centre, Andheri Centre"
                  required
                />
              </div>
            </div>

            <div className="moc-form-group">
              <label>
                <FaImage /> Location Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'location')}
                className="moc-file-input"
              />
              {locationImagePreview && (
                <img src={locationImagePreview} alt="Location Preview" className="moc-image-preview" />
              )}
            </div>

            <div className="moc-form-group">
              <label>
                <FaMapMarkerAlt /> Location Address
              </label>
              <textarea
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleChange}
                placeholder="Full address of the centre"
                rows="2"
              />
            </div>

            <div className="moc-form-row">
              <div className="moc-form-group">
                <label>
                  <FaPhone /> Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91-9876543210"
                />
              </div>

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
            </div>

            <div className="moc-form-group">
              <label>Google Maps Link</label>
              <input
                type="url"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
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

            <div className="moc-form-actions">
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                <FaSave /> {editingId ? 'Update Centre' : 'Add Centre'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Centres Table */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="moc-table-container">
          {Object.keys(groupedCentres).map((cityName) => (
            <div key={cityName} className="moc-city-section">
              <div className="moc-city-header-simple">
                <div className="moc-city-info-simple">
                  {groupedCentres[cityName][0].CityImage && (
                    <img 
                      src={groupedCentres[cityName][0].CityImage} 
                      alt={cityName}
                      className="moc-city-image-simple"
                    />
                  )}
                  <div>
                    <h3>{cityName}</h3>
                    <p>{groupedCentres[cityName].length} location(s)</p>
                  </div>
                </div>
              </div>

              <table className="moc-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedCentres[cityName].map((centre) => (
                    <tr key={centre.Id}>
                      <td>
                        <div className="moc-location-cell">
                          {centre.LocationImage && (
                            <img 
                              src={centre.LocationImage} 
                              alt={centre.LocationName}
                              className="moc-location-thumb"
                            />
                          )}
                          <strong>{centre.LocationName}</strong>
                        </div>
                      </td>
                      <td>{centre.LocationAddress || '-'}</td>
                      <td>{centre.ContactNumber || '-'}</td>
                      <td>
                        <span className={`moc-status-badge ${centre.IsActive ? 'active' : 'inactive'}`}>
                          {centre.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="moc-action-buttons">
                          <button 
                            className="btn-edit-small"
                            onClick={() => handleEdit(centre)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-delete-small"
                            onClick={() => handleDelete(centre.Id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCentres;
