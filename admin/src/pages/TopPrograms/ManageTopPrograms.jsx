import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { topProgramsApi, topProgramCategoriesApi } from '../../api/adminApi';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff, FaInfoCircle, FaUpload, FaFilePdf } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/ManageTopPrograms.css';

// CDN Upload helper
const CDN_URL = 'https://host0008-001-site1.qtempurl.com/api/uploadfile';

const uploadToCDN = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(CDN_URL, { method: 'POST', body: fd });
  const data = await res.json();
  
  let url = null;
  if (Array.isArray(data?.result)) {
    url = data.result[0]?.variants?.[0] || data.result[0]?.url;
  } else if (data?.result?.variants) {
    url = Array.isArray(data.result.variants) 
      ? data.result.variants[0] 
      : data.result.variants;
  } else if (data?.url) {
    url = data.url;
  } else if (typeof data?.result === 'string') {
    url = data.result;
  }
  
  if (!url) throw new Error('CDN upload failed');
  return url;
};

const ManageTopPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    slug: '',
    country: '',
    university: '', // Change from universityName to university
    duration: '',
    fee: '',
    description: '',
    imageFile: null, // File object for upload
    imageUrl: '', // Preview URL
    pdfFile: null, // PDF file for brochure
    brochureUrl: '', // PDF URL
    ctaText: 'Apply Now',
    ctaUrl: '#',
    isFeatured: false,
    isPopular: false,
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
    fetchPrograms();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await topProgramCategoriesApi.getAll();
      if (response.success) {
        const activeCategories = response.categories.filter(c => c.IsActive);
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await topProgramsApi.getAll();
      if (response.success) {
        setPrograms(response.programs);
      }
    } catch (error) {
      toast.error('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload image if new file selected
      let universityLogo = formData.imageUrl; // Use existing URL
      if (formData.imageFile instanceof File) {
        setUploading(true);
        universityLogo = await uploadToCDN(formData.imageFile);
        setUploading(false);
      }

      // Upload PDF if new file selected
      let brochureUrl = formData.brochureUrl; // Use existing URL
      if (formData.pdfFile instanceof File) {
        setPdfUploading(true);
        brochureUrl = await uploadToCDN(formData.pdfFile);
        setPdfUploading(false);
      }

      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
        // Map frontend fields to backend expected fields
        universityLogo: universityLogo,
        brochureUrl: brochureUrl === '#' || !brochureUrl ? null : brochureUrl,
      };
      
      // Remove file objects from payload
      delete payload.imageFile;
      delete payload.imageUrl;
      delete payload.pdfFile;
      delete payload.ctaText;
      delete payload.ctaUrl;
      
      if (editMode) {
        payload.id = editId;
      }
      
      const response = await topProgramsApi.upsert(payload);
      
      if (response.success) {
        toast.success(response.message || 'Program saved successfully!');
        resetForm();
        fetchPrograms();
      } else {
        toast.error(response.message || 'Failed to save program');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save program');
    } finally {
      setLoading(false);
      setUploading(false);
      setPdfUploading(false);
    }
  };

  const handleEdit = (program) => {
    setEditMode(true);
    setEditId(program.Id);
    setFormData({
      categoryId: program.CategoryId,
      title: program.Title,
      slug: program.Slug,
      country: program.Country || '',
      university: program.UniversityName || '', // Map UniversityName to university
      duration: program.Duration || '',
      fee: program.Fee || '',
      description: program.Description || '',
      imageFile: null, // No file for existing
      imageUrl: program.UniversityLogo || '', // Map UniversityLogo to imageUrl for preview
      pdfFile: null, // No PDF file for existing
      brochureUrl: program.BrochureUrl || '', // Keep existing brochure URL
      ctaText: program.CtaText || 'Apply Now',
      ctaUrl: program.CtaUrl || '#',
      isFeatured: program.IsFeatured,
      isPopular: program.IsPopular,
      displayOrder: program.DisplayOrder || 0,
      isActive: program.IsActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    try {
      await topProgramsApi.delete(id);
      toast.success('Program deleted');
      fetchPrograms();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({
      categoryId: '',
      title: '',
      slug: '',
      country: '',
      university: '',
      duration: '',
      fee: '',
      description: '',
      imageFile: null,
      imageUrl: '',
      pdfFile: null,
      brochureUrl: '',
      ctaText: 'Apply Now',
      ctaUrl: '#',
      isFeatured: false,
      isPopular: false,
      displayOrder: 0,
      isActive: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  // Handle image file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: previewUrl // For preview
    }));

    toast.success('Image selected! Will upload when you save.');
  };

  // Handle PDF file upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF size should be less than 10MB');
      return;
    }

    setFormData(prev => ({
      ...prev,
      pdfFile: file,
      brochureUrl: file.name // Show filename as preview
    }));

    toast.success('PDF selected! Will upload when you save.');
  };

  const goToDetails = (id) => {
    navigate(`/admin/top-programs/details/${id}`);
  };

  return (
    <div className="top-programs-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="top-programs-header">
        <h1>Manage Top Programs</h1>
        <p>Add programs for each category (MBA, Data Science, etc.)</p>
      </div>

      <div className="top-programs-form-card">
        <h2 className="form-title">
          {editMode ? 'Edit Program' : 'Add New Program'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Program Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. MBA in Finance"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="mba-in-finance"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. USA, UK, Canada"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g. Harvard University"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12 Months"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Fee</label>
              <input
                type="text"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                placeholder="e.g. $50,000"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>University Logo</label>
              
              {formData.imageUrl && (
                <div className="image-preview">
                  <img src={formData.imageUrl} alt="University Logo Preview" />
                </div>
              )}
              
              <div className="upload-controls">
                <label className={`upload-button ${uploading ? 'uploading' : ''}`}>
                  <FaUpload /> 
                  {uploading ? 'Uploading...' : (formData.imageFile ? 'Change Image' : 'Upload Logo')}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
                
                {formData.imageFile && (
                  <span className="file-name">
                    {formData.imageFile.name}
                  </span>
                )}
              </div>
              
              <div className="upload-info">
                Supported: JPG, PNG, GIF (Max 5MB)
              </div>
            </div>
          </div>
          
          <div className="form-full-width">
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Short description..."
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Brochure PDF</label>
              
              {formData.brochureUrl && !formData.pdfFile && (
                <div className="pdf-preview">
                  <div>
                    <FaFilePdf style={{ color: '#c53030', marginRight: '5px' }} />
                    <small>Current PDF uploaded</small>
                  </div>
                  <a 
                    href={formData.brochureUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    View PDF ↗
                  </a>
                </div>
              )}
              
              {formData.pdfFile && (
                <div className="pdf-new">
                  <small>📄 New: {formData.pdfFile.name}</small>
                </div>
              )}
              
              <label className={`pdf-upload-button ${pdfUploading ? 'uploading' : ''}`}>
                <FaFilePdf /> 
                {pdfUploading ? 'Uploading PDF...' : (formData.brochureUrl ? 'Replace PDF' : 'Upload Brochure')}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  disabled={pdfUploading}
                />
              </label>
              
              <div className="upload-info">
                PDF files only (Max 10MB)
              </div>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12 Months"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Featured</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
              />
              <span>Popular</span>
            </label>
            {editMode && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading || uploading}
              className="btn-submit"
            >
              {uploading ? (
                <>
                  <FaUpload /> Uploading Image...
                </>
              ) : loading ? (
                'Saving...'
              ) : (
                editMode ? 'Update' : 'Add Program'
              )}
            </button>
            {editMode && (
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="top-programs-table-card">
        <h2 className="table-title">Programs List</h2>
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="programs-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Country</th>
                  <th className="center">Featured</th>
                  <th className="center">Popular</th>
                  <th className="center">Status</th>
                  <th className="center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.length === 0 ? (
                  <tr><td colSpan="7" className="empty">No programs found</td></tr>
                ) : (
                  programs.map(prog => (
                    <tr key={prog.Id}>
                      <td>{prog.Title}</td>
                      <td>{prog.CategoryName}</td>
                      <td>{prog.Country || '—'}</td>
                      <td className="center">
                        {prog.IsFeatured ? '⭐' : '—'}
                      </td>
                      <td className="center">
                        {prog.IsPopular ? '🔥' : '—'}
                      </td>
                      <td className="center">
                        {prog.IsActive ? (
                          <FaToggleOn className="status-icon status-active" />
                        ) : (
                          <FaToggleOff className="status-icon status-inactive" />
                        )}
                      </td>
                      <td className="center">
                        <div className="action-buttons">
                          <button 
                            onClick={() => goToDetails(prog.Id)}
                            className="btn-detail"
                          >
                            Detail Page
                          </button>
                          <button 
                            onClick={() => handleEdit(prog)}
                            className="btn-edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDelete(prog.Id)}
                            className="btn-delete"
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
    </div>
  );
};

export default ManageTopPrograms;
