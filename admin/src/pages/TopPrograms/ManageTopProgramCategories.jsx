import React, { useState, useEffect } from 'react';
import { topProgramCategoriesApi } from '../../api/adminApi';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageTopProgramCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await topProgramCategoriesApi.getAll();
      
      if (response && response.success) {
        setCategories(response.categories);
      } else if (response && response.data && response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder, 10) || 0,
      };
      if (editMode) {
        payload.id = editId;
      }
      
      const response = await topProgramCategoriesApi.upsert(payload);
      
      if (response && response.success) {
        toast.success(response.message || 'Category saved successfully!');
        resetForm();
        fetchCategories();
      } else {
        toast.error(response.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save category';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditMode(true);
    setEditId(cat.Id);
    setFormData({
      name: cat.Name,
      slug: cat.Slug,
      icon: cat.Icon || '',
      displayOrder: cat.DisplayOrder || 0,
      isActive: cat.IsActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await topProgramCategoriesApi.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditId(null);
    setFormData({ name: '', slug: '', icon: '', displayOrder: 0, isActive: true });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, name, slug }));
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'var(--page-bg)' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px', color: 'var(--text-main)', fontWeight: '700' }}>Manage Top Program Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Categories like MBA, Data Science, AI & ML, etc.</p>
      </div>

      <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--orange)', fontWeight: '700' }}>
          {editMode ? 'Edit Category' : 'Add New Category'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. MBA, Data Science"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. mba, data-science"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>Icon (optional)</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g. fa-graduation-cap"
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-main)', fontSize: '13px' }}>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          {editMode && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ cursor: 'pointer' }}
                />
                <span>Active</span>
              </label>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '12px 24px', 
                background: 'var(--orange)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Saving...' : editMode ? 'Update' : 'Add Category'}
            </button>
            {editMode && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  padding: '12px 24px', 
                  background: 'var(--surface-2)', 
                  color: 'var(--text-main)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div style={{ background: 'var(--surface)', padding: '25px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--orange)', fontWeight: '700' }}>Categories List</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Slug</th>
                <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Icon</th>
                <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Order</th>
                <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface-2)' }}>No categories found</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.Id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-main)', fontSize: '14px' }}>{cat.Name}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>{cat.Slug}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>{cat.Icon || '—'}</td>
                    <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-main)', fontSize: '14px' }}>{cat.DisplayOrder}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {cat.IsActive ? (
                        <FaToggleOn style={{ color: '#48bb78', fontSize: '24px' }} />
                      ) : (
                        <FaToggleOff style={{ color: '#6c757d', fontSize: '24px' }} />
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleEdit(cat)}
                        style={{ 
                          padding: '8px 16px', 
                          background: '#3182ce', 
                          color: '#fff', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          marginRight: '8px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.Id)}
                        style={{ 
                          padding: '8px 16px', 
                          background: '#e53e3e', 
                          color: '#fff', 
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageTopProgramCategories;
