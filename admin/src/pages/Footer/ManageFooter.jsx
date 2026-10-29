import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFooterApi, navbarApi } from '../../api/adminApi';
import {
  FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff,
  FaTimes, FaLink, FaColumns, FaLayerGroup, FaBook,
  FaCheckCircle, FaTimesCircle, FaChevronDown, FaSitemap, FaExternalLinkAlt
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageLoader from '../../components/PageLoader';
import '../../assets/css/ManageFooter.css';

// ─── LinkFormModal ───────────────────────────────────────────
const LinkFormModal = ({ columnId, editLink, navbarLinks, onClose, onSaved }) => {
  const isEdit = !!editLink;

  // "navbar" = pick from existing navbar course, "custom" = manual entry
  const [linkType, setLinkType] = useState(
    isEdit ? (editLink.NavbarLinkId ? 'navbar' : 'custom') : 'navbar'
  );
  const [form, setForm] = useState({
    navbarLinkId: isEdit ? (editLink.NavbarLinkId || '') : '',
    title:        isEdit ? editLink.Title     : '',
    url:          isEdit ? editLink.Url       : '',
    sortOrder:    isEdit ? editLink.SortOrder : 0,
    isActive:     isEdit ? editLink.IsActive  : true,
  });
  const [loading, setLoading] = useState(false);

  // When user picks a navbar link — auto-fill title & url
  const handleNavbarSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      setForm(p => ({ ...p, navbarLinkId: '', title: '', url: '' }));
      return;
    }
    const found = navbarLinks.find(l => String(l.Id) === String(id));
    if (found) {
      setForm(p => ({
        ...p,
        navbarLinkId: found.Id,
        title:        found.Title,
        url:          found.Url || `/${found.Slug || found.Title.toLowerCase().replace(/\s+/g, '-')}`,
      }));
    }
  };

  const handle = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [e.target.name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.url.trim())   return toast.error('URL is required');

    setLoading(true);
    try {
      const payload = {
        title:        form.title.trim(),
        url:          form.url.trim(),
        navbarLinkId: linkType === 'navbar' ? (form.navbarLinkId || null) : null,
        sortOrder:    parseInt(form.sortOrder) || 0,
        isActive:     form.isActive,
      };

      if (isEdit) {
        const res = await adminFooterApi.updateLink(editLink.Id, payload);
        if (res.success) { toast.success('Link updated!'); onSaved(); }
        else toast.error(res.message || 'Error updating');
      } else {
        const res = await adminFooterApi.addLink(columnId, payload);
        if (res.success) { toast.success('Link added!'); onSaved(); }
        else toast.error(res.message || 'Error adding');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Removed onClick={onClose} from overlay to prevent closing on outside click
    <div className="mf-modal-overlay">
      <div className="mf-modal" onClick={e => e.stopPropagation()}>
        <div className="mf-modal-header">
          <h3 className="mf-modal-title">
            {isEdit ? <><FaEdit style={{ marginRight: 8 }} />Edit Link</> : <><FaPlus style={{ marginRight: 8 }} />Add Link</>}
          </h3>
          <button className="mf-modal-close" onClick={onClose} title="Close"><FaTimes /></button>
        </div>

        {/* Type Toggle */}
        <div className="mf-type-toggle">
          <button
            type="button"
            className={`mf-type-btn ${linkType === 'navbar' ? 'active' : ''}`}
            onClick={() => setLinkType('navbar')}
          >
            <FaSitemap className="mf-btn-icon-inline" /> Existing Navbar Course
          </button>
          <button
            type="button"
            className={`mf-type-btn ${linkType === 'custom' ? 'active' : ''}`}
            onClick={() => setLinkType('custom')}
          >
            <FaExternalLinkAlt className="mf-btn-icon-inline" /> Custom Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mf-form-full">

          {/* Navbar course picker */}
          {linkType === 'navbar' && (
            <div className="mf-form-group">
              <label className="mf-form-label">Select Navbar Course *</label>
              <select
                className="mf-form-select"
                value={form.navbarLinkId}
                onChange={handleNavbarSelect}
              >
                <option value="">-- Select a course --</option>
                {navbarLinks.map(l => (
                  <option key={l.Id} value={l.Id}>
                    {l.ParentId ? `  ↳ ${l.Title}` : l.Title}
                    {l.Category ? ` (${l.Category})` : ''}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: 11, color: '#718096', marginTop: 4 }}>
                Selecting a course auto-fills the title & URL below.
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mf-form-group">
            <label className="mf-form-label">Title *</label>
            <input
              className="mf-form-input"
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="e.g. Data Science"
              required
            />
          </div>

          {/* URL */}
          <div className="mf-form-group">
            <label className="mf-form-label">URL *</label>
            <input
              className="mf-form-input"
              name="url"
              value={form.url}
              onChange={handle}
              placeholder="e.g. /courses/data-science"
              required
            />
          </div>

          {/* Sort Order */}
          <div className="mf-form-group">
            <label className="mf-form-label">Sort Order</label>
            <input
              className="mf-form-input"
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handle}
            />
          </div>

          {/* Active toggle (edit mode only) */}
          {isEdit && (
            <div className="mf-checkbox-row">
              <input
                type="checkbox"
                id="linkActive"
                name="isActive"
                checked={form.isActive}
                onChange={handle}
              />
              <label htmlFor="linkActive">Active (visible on website)</label>
            </div>
          )}

          <div className="mf-form-actions">
            <button type="submit" className="mf-btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Link' : 'Add Link'}
            </button>
            <button type="button" className="mf-btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN ManageFooter ───────────────────────────────────────
const ManageFooter = () => {
  const navigate = useNavigate();
  const [pageLoading,  setPageLoading]  = useState(true);
  const [columns,      setColumns]      = useState([]);
  const [navbarLinks,  setNavbarLinks]  = useState([]);
  const [selectedCol,  setSelectedCol]  = useState(null); // selected column object
  const [links,        setLinks]        = useState([]);   // links of selected column
  const [linksLoading, setLinksLoading] = useState(false);

  // Column form
  const [colForm,     setColForm]     = useState({ heading: '', sortOrder: 0 });
  const [colEditMode, setColEditMode] = useState(false);
  const [colEditId,   setColEditId]   = useState(null);
  const [colLoading,  setColLoading]  = useState(false);

  // Link modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editLink,      setEditLink]      = useState(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchColumns = useCallback(async () => {
    try {
      const res = await adminFooterApi.getColumns();
      if (res.success) setColumns(res.columns);
    } catch (err) { console.error(err); }
    finally { setPageLoading(false); }
  }, []);

  const fetchNavbarLinks = useCallback(async () => {
    try {
      const res = await navbarApi.getNavbarLinks();
      if (res.success) setNavbarLinks(res.flatLinks || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchLinks = useCallback(async (columnId) => {
    setLinksLoading(true);
    try {
      const res = await adminFooterApi.getLinks(columnId);
      if (res.success) setLinks(res.links);
    } catch (err) { console.error(err); }
    finally { setLinksLoading(false); }
  }, []);

  useEffect(() => {
    fetchColumns();
    fetchNavbarLinks();
  }, [fetchColumns, fetchNavbarLinks]);

  // Re-fetch links when selected column changes
  useEffect(() => {
    if (selectedCol) fetchLinks(selectedCol.Id);
    else setLinks([]);
  }, [selectedCol, fetchLinks]);

  // ── Column CRUD ────────────────────────────────────────────
  const handleColSubmit = async (e) => {
    e.preventDefault();
    if (!colForm.heading.trim()) return toast.error('Heading is required');
    setColLoading(true);
    try {
      if (colEditMode) {
        const res = await adminFooterApi.updateColumn(colEditId, {
          heading:   colForm.heading,
          sortOrder: parseInt(colForm.sortOrder) || 0,
          isActive:  true,
        });
        if (res.success) { toast.success('Column updated!'); resetColForm(); fetchColumns(); }
        else toast.error(res.message);
      } else {
        const res = await adminFooterApi.addColumn({
          heading:   colForm.heading,
          sortOrder: parseInt(colForm.sortOrder) || 0,
        });
        if (res.success) { toast.success('Column added!'); resetColForm(); fetchColumns(); }
        else toast.error(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally { setColLoading(false); }
  };

  const handleColEdit = (col, e) => {
    e.stopPropagation();
    setColEditMode(true);
    setColEditId(col.Id);
    setColForm({ heading: col.Heading, sortOrder: col.SortOrder || 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleColDelete = async (col, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete column "${col.Heading}" and all its links?`)) return;
    try {
      const res = await adminFooterApi.deleteColumn(col.Id);
      if (res.success) {
        toast.success('Column deleted');
        if (selectedCol?.Id === col.Id) { setSelectedCol(null); setLinks([]); }
        fetchColumns();
      }
    } catch (err) { toast.error('Error deleting column'); }
  };

  const handleColToggle = async (col, e) => {
    e.stopPropagation();
    try {
      await adminFooterApi.toggleColumn(col.Id);
      fetchColumns();
    } catch (err) { console.error(err); }
  };

  const resetColForm = () => {
    setColEditMode(false);
    setColEditId(null);
    setColForm({ heading: '', sortOrder: 0 });
  };

  // ── Link CRUD ──────────────────────────────────────────────
  const handleLinkToggle = async (link) => {
    try {
      await adminFooterApi.toggleLink(link.Id);
      fetchLinks(selectedCol.Id);
    } catch (err) { console.error(err); }
  };

  const handleLinkDelete = async (link) => {
    if (!window.confirm(`Delete link "${link.Title}"?`)) return;
    try {
      const res = await adminFooterApi.deleteLink(link.Id);
      if (res.success) { toast.success('Link deleted'); fetchLinks(selectedCol.Id); }
    } catch (err) { toast.error('Error deleting link'); }
  };

  const openAddLink  = () => { setEditLink(null); setShowLinkModal(true); };
  const openEditLink = (link) => { setEditLink(link); setShowLinkModal(true); };
  const closeLinkModal = () => { setShowLinkModal(false); setEditLink(null); };
  const onLinkSaved  = () => { closeLinkModal(); fetchLinks(selectedCol.Id); };

  return (
    <div className="mf-page">
      {pageLoading && <PageLoader message="Loading footer data..." />}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Column Form Card ─────────────────────────────── */}
      <div className="mf-card">
        <h2 className="mf-title">Manage Footer</h2>
        <p className="mf-subtitle">
          Add as many columns as you want. Click a column to manage its links.
          Links can be picked from existing navbar courses (auto-fills title & URL) or added manually.
        </p>

        <h3 className="mf-section-title">
          <FaColumns /> {colEditMode ? 'Edit Column' : 'Add New Column'}
        </h3>

        <form onSubmit={handleColSubmit}>
          <div className="mf-form-row">
            <div className="mf-form-group">
              <label className="mf-form-label">Column Heading *</label>
              <input
                className="mf-form-input"
                value={colForm.heading}
                onChange={e => setColForm(p => ({ ...p, heading: e.target.value }))}
                placeholder="e.g. Analytics Courses"
                required
              />
            </div>
            <div className="mf-form-group" style={{ maxWidth: 120 }}>
              <label className="mf-form-label">Sort Order</label>
              <input
                className="mf-form-input"
                type="number"
                value={colForm.sortOrder}
                onChange={e => setColForm(p => ({ ...p, sortOrder: e.target.value }))}
              />
            </div>
            <button type="submit" className="mf-btn-primary" disabled={colLoading}>
              {colLoading ? 'Saving...' : colEditMode ? 'Update Column' : 'Add Column'}
            </button>
            {colEditMode && (
              <button type="button" className="mf-btn-secondary" onClick={resetColForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Columns Grid ─────────────────────────────────── */}
      <div className="mf-card">
        <h3 className="mf-section-title">
          <FaLayerGroup /> Footer Columns
          <span style={{ marginLeft: 8, fontSize: 12, color: '#718096', fontWeight: 400 }}>
            (Click a column to manage its links)
          </span>
        </h3>

        {columns.length === 0 && !pageLoading ? (
          <div className="mf-no-col-msg">
            <FaColumns />
            No columns yet. Add your first column above.
          </div>
        ) : (
          <div className="mf-columns-grid">
            {columns.map(col => (
              <div
                key={col.Id}
                className={`mf-col-card ${selectedCol?.Id === col.Id ? 'selected' : ''} ${!col.IsActive ? 'inactive' : ''}`}
                onClick={() => setSelectedCol(col.Id === selectedCol?.Id ? null : col)}
              >
                <div className="mf-col-card-header">
                  <span className="mf-col-heading">{col.Heading}</span>
                  <div className="mf-col-actions">
                    <button
                      className={`mf-btn-icon ${col.IsActive ? 'status-active' : 'status-inactive'}`}
                      onClick={(e) => handleColToggle(col, e)}
                      title={col.IsActive ? 'Hide' : 'Show'}
                    >
                      {col.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button className="mf-btn-icon edit" onClick={(e) => handleColEdit(col, e)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="mf-btn-icon delete" onClick={(e) => handleColDelete(col, e)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="mf-col-meta">
                  <span>Order: {col.SortOrder}</span>
                  <span>
                    {col.IsActive 
                      ? <><FaCheckCircle color="#38a169" size={12}/> Active</> 
                      : <><FaTimesCircle color="#e53e3e" size={12}/> Hidden</>
                    }
                  </span>
                </div>
                {selectedCol?.Id === col.Id && (
                  <div className="mf-select-hint">
                    <FaChevronDown style={{ marginRight: '4px' }} /> Managing links below
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Links Section ─────────────────────────────────── */}
      {selectedCol && (
        <div className="mf-card" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <div className="mf-links-header">
            <h3 className="mf-section-title" style={{ margin: 0 }}>
              <FaLink />
              Links in:
              <span className="mf-links-heading-badge">{selectedCol.Heading}</span>
            </h3>
            <button className="mf-btn-primary" onClick={openAddLink}>
              <FaPlus style={{ marginRight: 6 }} /> Add Link
            </button>
          </div>

          {linksLoading ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '24px 0' }}>Loading links...</p>
          ) : (
            <div className="mf-table-container">
              <table className="mf-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Type</th>
                    <th>Order</th>
                    <th className="mf-td-center">Status</th>
                    <th className="mf-td-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.length === 0 ? (
                    <tr><td colSpan={6} className="mf-empty-row">No links yet — add your first link!</td></tr>
                  ) : (
                    links.map(link => (
                      <tr key={link.Id}>
                        <td style={{ fontWeight: 600 }}>{link.Title}</td>
                        <td style={{ color: '#718096', fontSize: 12 }}>{link.Url}</td>
                        <td>
                          {link.NavbarLinkId
                            ? <span className="mf-navbar-badge"> Navbar</span>
                            : <span className="mf-custom-badge"> Custom</span>
                          }
                        </td>
                        <td>{link.SortOrder}</td>
                        <td className="mf-td-center">
                          <button
                            className={`mf-btn-icon ${link.IsActive ? 'status-active' : 'status-inactive'}`}
                            onClick={() => handleLinkToggle(link)}
                            title={link.IsActive ? 'Hide' : 'Show'}
                          >
                            {link.IsActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </td>
                        <td>
                          <div className="mf-td-actions">
                            {!link.NavbarLinkId && (
                              <button
                                className="mf-btn-details"
                                onClick={() => navigate(`/admin/footer-link-detail/${link.Id}`)}
                              >
                                <FaBook /> Details
                              </button>
                            )}
                            <button className="mf-btn-icon edit"   onClick={() => openEditLink(link)}    title="Edit"><FaEdit /></button>
                            <button className="mf-btn-icon delete" onClick={() => handleLinkDelete(link)} title="Delete"><FaTrash /></button>
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
      )}

      {/* ── Link Modal ─────────────────────────────────────── */}
      {showLinkModal && (
        <LinkFormModal
          columnId={selectedCol?.Id}
          editLink={editLink}
          navbarLinks={navbarLinks}
          onClose={closeLinkModal}
          onSaved={onLinkSaved}
        />
      )}
    </div>
  );
};

export default ManageFooter;